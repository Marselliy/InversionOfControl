// Пример оборачивания функции в песочнице

var fs = require('fs'),
    vm = require('vm');

// Объявляем хеш из которого сделаем контекст-песочницу
var context = {
  module: {},
  console: console,
  // Оборачиваем функцию setTimeout в песочнице
  setTimeoutContext: function(callback, timeout) {
    // Добавляем поведение при вызове setTimeout
    console.log(
      'Call: setTimeout, ' +
      'callback function: ' + callback.name + ', ' +
      'timeout: ' + timeout
    );
    setTimeout(function() {
      // Добавляем поведение при срабатывании таймера
      console.log('Event: setTimeout, before callback');
      // Вызываем функцию пользователя на событии таймера
      callback();
      console.log('Event: setTimeout, after callback');
    }, timeout);
  },
  fsWrapper: {},
  statsFunctimes: {},
  statsFuncalls: {},
  writtenBytes: {},
  readBytes: {},
  displayStats: function() {
	  console.log("Calls:");
	  console.log(context.statsFuncalls);
	  var map = {};
	  console.log("Average times:");
	  for (var key in context.statsFuncalls) {
		  map[key] = context.statsFunctimes[key] / context.statsFuncalls[key];
	  }
	  console.log(map);
	  console.log(context.writtenBytes);
  }
};
function wrapFunction(fnName, fn) {
  return function wrapper() {
    var args = [];
	var date = new Date();
    Array.prototype.push.apply(args, arguments);
	switch (fnName) {
		case 'writeFile': {
			context.writtenBytes += arguments[1].length;
		}
		case 'readFile': {
			
		}
	}
    console.log('Call: ' + fnName + ' Date: ' + date);
    console.dir(args);
	context.statsFuncalls[fnName]++;
	var start = date.getTime();
    fn.apply(undefined, args);
	context.statsFunctimes[fnName] += (date.getTime() - start);
  }
}
function wrapFS () {
	for (var key in fs) {
		context.fsWrapper[key] = wrapFunction(key, fs[key]);
		context.statsFuncalls[key] = 0;
		context.statsFunctimes[key] = 0;
		context.writtenBytes[key] = 0;
		context.readBytes[key] = 0;
	}
}
wrapFS();

// Преобразовываем хеш в контекст
context.global = context;
var sandbox = vm.createContext(context);

// Читаем исходный код приложения из файла
var fileName = './application.js';
fs.readFile(fileName, function(err, src) {
  // Запускаем код приложения в песочнице
  var script = vm.createScript(src, fileName);
  script.runInNewContext(sandbox);
});

