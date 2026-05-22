export const getFileName = (fileUrl) => {
  const splittedFileUrl = fileUrl.split('/');
  return splittedFileUrl[splittedFileUrl.length - 1];
};

export const getFileExtension = (fileUrl) => {
  const fileName = getFileName(fileUrl);
  const splitted = fileName.split('.');
  return splitted[splitted.length - 1];
};
