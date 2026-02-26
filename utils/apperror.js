class Apperror extends Error {
  constructor(message, statusCode, statustext) {
    super(message);
    this.statusCode = statusCode;
    this.statustext = statustext;
  }
}
export default Apperror;
