const receiveMessage = (evt) => {
  console.log(evt.data);
};

const setupLogs = () => {
  var log = document.querySelector(".editor-console");
  ["log", "debug", "info", "warn", "error"].forEach(function (verb) {
    console[verb] = (function (method, verb, log) {
      return function () {
        const newArgs = [...arguments];
        newArgs.forEach((argument, index) => {
          if (typeof argument === "object" && argument !== null) {
            newArgs[index] = JSON.stringify(argument, null, 2);
          }
        });
        method.apply(console, arguments);
        var msg = document.createElement("div");

        let colorClass = null;

        switch (verb) {
          case "error":
            colorClass = "danger";
            break;

          case "success":
            colorClass = "success";
            break;

          case "warn":
            colorClass = "warning";
            break;

          case "info":
            colorClass = "info";
            break;

          case "log":
          default:
            colorClass = "white";
        }

        msg.classList.add(verb, "console-item", "mb-2");
        msg.innerHTML = `<pre style='overflow: visible;' class='text-${colorClass}'>${Array.prototype.slice.call(newArgs).join(" ")}</pre><hr />`;
        log.appendChild(msg);
      };
    })(console[verb], verb, log);
  });
};

module.exports = {
  setupLogs,
};
