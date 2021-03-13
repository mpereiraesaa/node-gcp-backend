const AppMiddleware = module.exports;

const Multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const JwtService = require('./utils/JwtService');
const { getPublicUrl } = require('./utils/Upload');

const { GOOGLE_CLOUD_PROJECT } = process.env;
const CLOUD_BUCKET = GOOGLE_CLOUD_PROJECT + '_bucket';
const storage = new Storage();
const bucket = storage.bucket(CLOUD_BUCKET);

AppMiddleware.multer = Multer({
  storage: Multer.MemoryStorage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

AppMiddleware.fileUpload = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const name = Date.now() + req.file.originalname;
  const file = bucket.file(name);

  const stream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype,
    },
    resumable: false,
  });

  stream.on('error', (err) => {
    req.file.cloudStorageError = err;
    next(err);
  });

  stream.on('finish', async () => {
    req.file.cloudStorageObject = name;

    await file.makePublic();

    req.file.cloudStoragePublicUrl = getPublicUrl(name);
    next();
  });

  stream.end(req.file.buffer);
};

AppMiddleware.adminAccess = ((req, res, next) => {
  const authorization = req.header('Authorization');

  if (!authorization) {
    throw new Error('Invalid token');
  }

  try {
    const { isAdmin } = JwtService.verifyToken(authorization);

    if (isAdmin) return next();
  } catch (err) {
    throw new Error('unauthorized');
  }
});

AppMiddleware.userAccess = ((req, res, next) => {
  const authorization = req.header('Authorization');

  if (!authorization) {
    throw new Error('Invalid token');
  }

  try {
    const { userId } = JwtService.verifyToken(authorization);

    if (userId) return next();
  } catch (err) {
    throw new Error('unauthorized');
  }
});
