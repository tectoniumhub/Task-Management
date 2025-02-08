import * as os from "node:os";
import * as timers from "node:timers";

class TaskManager
{
    private systemLimit: number;
    private queue: Array<() => void> = [];
    private timeoutValue: number;
    private isRunning: boolean = false;

    /**
     * @comment You can set a positive number for memory limit. Default value is 100
     * @comment You can set Timeout value for memory limit. Default value is 3 seconds. You can use "ms" module for converting your string to number
     * ```js
     * const Manager = require("tasks-handler");
     * 
     * const manager = new Manager({ memoryLimit: 50, Timeout: 5000 });
     * ```
     * Or
     * ```js
     * const Manager = require("tasks-handler");
     * 
     * const manager = new Manager({ Timeout: 10 * 1000 });
     * ```
     * Or
     * ```js
     * const Manager = require("tasks-handler");
     * 
     * const manager = new Manager({ memoryLimit: 200 });
     * ```
     */
    constructor(memoryLimit: number = 100, Timeout: number = 3 * 1000)
    {
        this.systemLimit = memoryLimit;
        this.timeoutValue = Timeout;
    }

    /**
     * @comment Add functions but don't put an array. For example 
     * ```js
     * const Manager = require("tasks-handler");
     * 
     * // Memory limit is optional because default value is 100
     * const manager = new Manager();
     * 
     * manager.addTask(() => {
     *              console.log("1st task is completed");
     * });
     * 
     * manager.addTask(() => {
     *              console.log("2nd task is completed")
     * });
     * ```
     * In this way you need to setup or add tasks
     */
    public async addTask(task: () => void)
    {
        this.queue.push(task);
        await this.nextFunction();
    }

    private async nextFunction(): Promise<void>
    {
        if(this.isRunning || this.queue.length === 0) return;

        const availableMemory = await this.getAvailableMemory();
        if(availableMemory < this.systemLimit)
        {
            await new Promise((resolve) => timers.setTimeout(resolve, this.timeoutValue));
            await this.nextFunction();
            return;
        }

        this.isRunning = true;
        const task = this.queue.shift();

        if(task)
        {
            try
            {
                await task();
            }
            catch (error)
            {
                console.log(error);
            }
        }

        this.isRunning = false;
        await this.nextFunction();
    }

    private getAvailableMemory(): number
    {
        const memoryCache = Math.floor(os.freemem() / 1024 / 1024);
        return memoryCache;
    }
}

export default TaskManager;