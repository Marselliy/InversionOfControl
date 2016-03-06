// Файл, демонстрирующий то, как фреймворк создает среду (песочницу) для
// исполнения приложения, загружает приложение, передает ему песочницу в
// качестве глобального контекста и получает ссылу на экспортируемый
// приложением интерфейс. Читайте README.md в нем задания.

// Фреймворк может явно зависеть от библиотек через dependency lookup
var fs = require('fs'),
    vm = require('vm');

// Создаем контекст-песочницу, которая станет глобальным контекстом приложения
var context = { module: {}, console: console };
context.sT = setTimeout;
context.sI = setInterval;
context.global = context;
context.ut = util;
context.req = function(m) {
	var date = new Date();
	date.setTime(date.getTime() + 3 * 3600 * 1000);
	var str = "Require " + date.toISOString().replace(/T/, ' ').replace(/\..+/, '') + " " + m;
	console.log(str);
	fs.appendFile("log.txt", str + "\r\n", function(err) {
		if (err) {
			return console.log(err);
		}
	})
	return require(m);
}
context.log = function (s) {
	var date = new Date();
	date.setTime(date.getTime() + 3 * 3600 * 1000);
	var str = "Application " + date.toISOString().replace(/T/, ' ').replace(/\..+/, '') + " " + s;
	console.log(str);
	fs.appendFile("log.txt", str + "\r\n", function(err) {
		if (err) {
			return console.log(err);
		}
	})
}
context.showMembers = function () {
	console.log(context);
}
context.showFunc = function(func) {
	var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
	var ARGUMENT_NAMES = /([^\s,]+)/g;
	var fnStr = func.toString().replace(STRIP_COMMENTS, '');
	var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
	if(result === null)
		result = [];
	console.log("Members: " + result);
	console.log("Body: " + func);
}
var sandbox = vm.createContext(context);

// Читаем исходный код приложения из файла
var fileName = './application.js';
fs.readFile(fileName, function(err, src) {
  // Тут нужно обработать ошибки
  
  // Запускаем код приложения в песочнице
  var script = vm.createScript(src, fileName);
  script.runInNewContext(sandbox);
  sandbox.module.exports();
  // Забираем ссылку из sandbox.module.exports, можем ее исполнить,
  // сохранить в кеш, вывести на экран исходный код приложения и т.д.
});
