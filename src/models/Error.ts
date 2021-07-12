interface IError {
  msg: String | 'Something went wrong';
  error?: Object | any;
}

export default IError;
