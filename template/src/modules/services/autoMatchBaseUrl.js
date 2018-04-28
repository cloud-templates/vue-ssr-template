/**
 * 根据前缀，自动匹配基础的url
 * 根据项目所需，自己扩展
 * @param prefix
 * @returns {string}
 */
import config from 'config';

export default function autoMatchBaseUrl(prefix) {
  let baseUrl = '';
  switch (prefix) {
    case config.UPLOADING_PREFIX:
      baseUrl = config.API_UPLOAD;
      break;
    default:
      baseUrl = config.API_HOME;
  }

  return `${baseUrl}${prefix}`;
}
