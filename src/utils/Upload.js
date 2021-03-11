const Upload = module.exports;

const { GOOGLE_CLOUD_PROJECT } = process.env;
const CLOUD_BUCKET = GOOGLE_CLOUD_PROJECT + '_bucket';

Upload.getPublicUrl = (filename) => {
  return `https://storage.googleapis.com/${CLOUD_BUCKET}/${filename}`;
};
