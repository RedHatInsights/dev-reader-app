const deniedKeyWords = [
  'alter table ',
  'create ',
  'delete from ',
  'insert into ',
  /update \w+ set/g,
  'drop '
];

const sqlValidator = (value) => {
  const preprocessedField = value.toLowerCase().replaceAll(/\r?\n|\r/g, ' ').replaceAll(/ +/g, ' ');

  const error = deniedKeyWords.find(keyWord => preprocessedField.match(keyWord))

  if(error) {
    return 'Only SELECT statement is supported'
  }
}

export default sqlValidator;
