# **TASKS HANDLER**

## **INFORMATION:**
Tasks Handler is a module that manages the functions or tasks of NodeJS. It also keeps the memory limit under control so that no problem can occur in the system. It helps to start another one when one task is completed.

## **USAGE:**
It is easy to use. It is used in this way
```js
const Manager = require("tasks-handler");

const manager = new Manager();

manager.addTask(() => {
    console.log("1st task is completed");
});

manager.addTask(() => {
    console.log("2nd task is completed");
});
```
Remember that this should only attempt to setup the task in the above manner