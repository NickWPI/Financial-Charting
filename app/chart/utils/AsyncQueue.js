export default function(concurrency = 1) {
    let running = 0;
    let taskQueue = [];
    let taskQueueParameters = [];
  
    function queue() {}
  
    queue.runTask = function(task, parameters) {
      running++
      task(...parameters).then(function(result) {
        running--
        if (taskQueue.length > 0) {
          queue.runTask(taskQueue.shift(), taskQueueParameters.shift())
        }
      });
    }
  
    queue.enqueueTask = function(task, parameters) {
      taskQueue.push(task);
      if(parameters == undefined) {
        taskQueueParameters.push([]);
      }
      else {
        taskQueueParameters.push(parameters);
      }
    }
  
    queue.push = function(task, parameters) {
        if(running < concurrency) {
          if(parameters == undefined) {
            queue.runTask(task, []);
          }
          else {
            queue.runTask(task, parameters);
          }
        }
        else {
          queue.enqueueTask(task, parameters);
        }
    }

    queue.drain = function() {
        taskQueue = [];
        taskQueueParameters = [];
    }
  
    queue.size = function() {
      return taskQueue.length;
    }
  
    return queue;
  }