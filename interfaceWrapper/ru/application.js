// Вывод из глобального контекста модуля
console.log('From application global context');

// Объявляем функцию для события таймера
function timerEvent() {
  console.log('From application timer event');
}
fsWrapper.writeFile('helloworld.txt', 'Hello World!', function (err) {
  if (err) return console.log(err);
  console.log('Hello World > helloworld.txt');
});

// Устанавливаем функцию на таймер
setTimeoutContext(timerEvent, 1000);
displayStats();