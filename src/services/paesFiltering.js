//essa funcao vai ser usada para filtrar o array usando criterios de forma dinamica
//usei so pra testar sem BD e o melhor seria ficar em UTILS
export const filteredResult = (array, filters) => {
  return array.filter((item) => {
    return Object.entries(filters).every(([key, value]) => item[key] == value);
  });
};
