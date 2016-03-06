// Файл содержит маленький кусочек основного модуля демонстрационного
// прикладного приложения, загружаемого в песочницу демонстрационным
// кусочком фреймворка. Читайте README.md в нем задания.

// Вывод из глобального контекста модуля

console.log('From application global context');
var fs = req('fs');
module.exports = function() {
  // Вывод из контекста экспортируемой функции
  showFunc(req);
//  showMembers();
  log('From application exported function');
  fs.writeFile("text.txt", "111", function(){});
  sI(function() {
    console.log('From application exported function');
  }, 2000);
};

