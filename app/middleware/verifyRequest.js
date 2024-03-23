const { format } = require("date-fns");
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");
const allowedUserAgents = require("../config/allowedUserAgents");

const todayDate = `${format(new Date(), format(new Date(), "yyyy-MM-dd"))}`;

const isUserAgentAllowed = (userAgent) => {
  // Converter o agente do usuário para minúsculas para corresponder independentemente de maiúsculas e minúsculas
  userAgent = String(userAgent).toLowerCase();

  // Verificar se o agente do usuário contém pelo menos uma das strings permitidas
  for (let allowedAgent of allowedUserAgents) {
    if (userAgent.includes(allowedAgent)) {
      return true;
    }
  }
  return false;
};
const verifyRequest = async (req, res, next) => {
  const ip = req.ip;
  const userAgent = req.headers["user-agent"];
  const ipVerify = await verifyBlockList(ip);

  if (!isUserAgentAllowed(userAgent)) {
    console.log(`${ip} trying to shut down the server`);
    return res.sendStatus(403);
  }

  if (ipVerify) {
    return res.sendStatus(403);
  } else {
    await ipVerification(req);
    next();
  }
};
const ipVerification = async (req) => {
  const currentIp = req.ip;
  const filePath = path.join(
    __dirname,
    "..",
    "logs",
    `${todayDate}-eventLog.txt`
  );
  // Função que retorna uma Promise para ler o arquivo
  const readLogFile = () => {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, "utf-8", (err, data) => {
        if (err) {
          reject(err); // Rejeita a Promise com o erro
        } else {
          const logs = data.split("\n");
          resolve(logs); // Resolve a Promise com os logs
        }
      });
    });
  };

  let ipCall = 0;
  let lastCallMinute = null;
  let countOfCallsByMinute = 0;
  let countOfCallsByDay = 0;
  // Chamada da função assíncrona
  readLogFile()
    .then(async (logs) => {
      for (let i in logs) {
        let index = parseInt(i);
        if (!logs[index + 1]) return;
        let logIp = logs[index].split("|")[6];
        if (currentIp === logIp) {
          countOfCallsByDay++;
          ipCall++;
          let minute = logs[index].split("|")[1].split(":")[1];
          if (minute !== lastCallMinute) {
            lastCallMinute = minute;
            countOfCallsByMinute = 0;
          } else {
            countOfCallsByMinute++;
          }
          if (countOfCallsByMinute >= process.env.MAX_REQUEST_BY_MINUTE) {
            writeExcluded(req, true);
          }
          if (countOfCallsByDay >= process.env.MAX_REQUEST_BY_DAY) {
            writeExcluded(req, false);
          }
        }
      }
    })
    .catch((err) => {
      console.error(err);
    });
};
const verifyBlockList = async (currentIp) => {
  try {
    const dirPath = path.join(__dirname, "..", "logs");
    const permantentFilePath = path.join(
      __dirname,
      "..",
      "logs",
      "excludeListPermanent.txt"
    );
    const temporaryFilePath = path.join(
      __dirname,
      "..",
      "logs",
      `${todayDate}-excludeListDay.txt`
    );
    const readBanFile = async () => {
      if (!fs.existsSync(dirPath)) {
        await fsPromises.mkdir(dirPath);
      }

      // Verifica se o arquivo permanente existe antes de ler
      if (fs.existsSync(permantentFilePath)) {
        const data = await fsPromises.readFile(permantentFilePath, "utf-8");
        if (data.includes(currentIp))
          return `IP ${currentIp}: banned permantently`;
      }

      // Verifica se o arquivo temporário existe antes de ler
      if (fs.existsSync(temporaryFilePath)) {
        const data = await fsPromises.readFile(temporaryFilePath, "utf-8");
        if (data.includes(currentIp))
          return `IP ${currentIp}: banned temporarily`;
      }
    };

    // Chama a função para ler o arquivo de bloqueio
    return readBanFile();
  } catch (e) {
    console.error(e);
  }
};

const writeExcluded = async (req, permanent) => {
  const ip = req.ip;
  const dirPath = path.join(__dirname, "..", "logs");
  const permantentFilePath = path.join(
    __dirname,
    "..",
    "logs",
    "excludeListPermanent.txt"
  );
  const temporaryFilePath = path.join(
    __dirname,
    "..",
    "logs",
    `${todayDate}-excludeListDay.txt`
  );

  const timeNow = `${format(
    new Date(),
    format(new Date(), "yyyy-MM-dd|HH:mm:ss")
  )}`;
  try {
    const item = `${timeNow}|${ip}|${req.url}\n`;

    if (!fs.existsSync(dirPath)) {
      await fsPromises.mkdir(dirPath);
    }
    if (!fs.existsSync(permantentFilePath)) {
      await fsPromises.writeFile(permantentFilePath, item);
    }
    if (!fs.existsSync(temporaryFilePath)) {
      await fsPromises.writeFile(temporaryFilePath, item);
    }

    if (permanent) {
      await fsPromises.appendFile(permantentFilePath, item);
    } else {
      await fsPromises.appendFile(temporaryFilePath, item);
    }
  } catch (e) {
    console.error(e);
  }
};

module.exports = verifyRequest;
