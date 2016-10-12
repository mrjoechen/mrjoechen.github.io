---
layout:     post
title:      "Android Content Provider "
subtitle:   " \"带你了解Android中异步任务AsyncTask\""
date:       2015-07-31 12:00:00
author:     "Joe"
header-img: "img/post-2016-high.jpg"
tags:
    - Android学习笔记
    - AsyncTask
    - 异步任务


---



### Android AsyncTask



- 异步任务解决什么问题
 -     Android的单线程模型，只有主线程(UI线程)才能操作UI，保证UI稳定性
 -  耗时操作放在非主线程中执行，如网络操作，读取文件等，避免ANR

- 异步任务作用
 -  子线程中更新UI
 -  封装，简化异步操作

##### 使用方法
* 构建Android AsyncTask子类的参数
`AsyncTask<Params,Progress,Result>`是一个抽象类，继承AsyncTask需要制定以下三个泛型参数：
 *  Params：启动任务时输入的参数类型
 * Progress：后台任务执行中返回的进度值类型
 * Result：后台执行任务完成后返回的结果类型
* 构建AsyncTask子类的4个核心回调方法
  * `onPreExecute()`：在主线程中执行，执行后台耗时操作前被调用，通常用户完成一些初始化操作，
 * `doInBackground(Params...params) `：必须重写，在线程池中执行，异步执行后台线程将要完成的任务
 * `onPostExecute(Result result)`：在主线程中执行，当doInBackground完成后，系统会自动调用onPostExecute方法，并将doInBackground方法返回值即result传给该方法
 * `onProgressUpdate(Progress...values)`：在主线程中执行，在doInBackground方法中调用publishProgress方法更新任务的执行进度后会触发该方法，参数即为publishProgress传递过来的参数。 
* 注意：
AsyncTask底层是通过线程池运行的，当一个线程还没有执行完毕的时候，后面的线程是没办法执行的，必须等到前面的task执行完毕之后又才执行。解决方法：调用AsyncTask的onCancleed方法。
例如：
 1. 在Activity中使用AsyncTask时，可以与activity中的onPause方法绑定：
```
	protected void onPause(){
		super.onPause();
		if(myAsyncTask!=null && myAsyncTask.getStatus() == AsyncTask.Status.RUNNING){
		//cancle方法只是将对应的AsyncTask标记为cancle状态，并不是真正取消线程执行，
		myAsyncTask.cancle(true);
		}
	}
```

同时在具体的异步线程中去检测当前线程的状态：
```
//在doInBackground方法中加一个判断：
if(isCancled()){
	rerurn;
}
```
2. 必须在UI线程中创建AsyncTask实例
3. 必须在UI线程中调用AsyncTask的execute()方法
4. 重写的四个方法是系统自动调用，不应手动调用，也不能手动调用
5. 每个AsyncTask只能被执行一次，多次调用会引发异常。

-----------------------


#### AsyncTask
	
	new AsyncTask<String,String,String>(){
		// 运行在主线程中，做预备工作
		onPreExecute(){

		}
		// 运行在子线程中，做耗时操作
		String doingBackGround(String s){

		}
		// 运行在主线程中，耗时操作完成，更新UI
		onPostExecute(String s){
					
		}

	}.execute(String);

> #### AsyncTask的execute方法

	public final AsyncTask<Params, Progress, Result> execute(Params... params) {
	        ...
	
	        mStatus = Status.RUNNING;
			// 在主线程中执行准备操作
	        onPreExecute();
			// 把params参数赋值给mWorker
	        mWorker.mParams = params;
			// 用线程池执行mFuture
	        sExecutor.execute(mFuture);

	// 在AsyncTask构造方法中创建了mWorker
	    mWorker = new WorkerRunnable<Params, Result>() {
            public Result call() throws Exception {
               ...
            }
        };

        mFuture = new FutureTask<Result>(mWorker) {
            @Override
            protected void done() {
                ...
            }
        };
    }
		// 把mWorker传递给FutureTask，callable指的就是mWorker
		public FutureTask(Callable<V> callable) {
		        if (callable == null)
		            throw new NullPointerException();
		        sync = new Sync(callable);
		    }
		// 把mWorker传递给Sync，callable指的是mWorker
		Sync(Callable<V> callable) {
		            this.callable = callable;
		        }

> #### 线程池执行FutureTask，就是执行FutureTask的run方法,代码如下：

		public void run() {
				// 转调
		        sync.innerRun();
		    }
      
		void innerRun() {
		            if (!compareAndSetState(READY, RUNNING))
		                return;
		
		            runner = Thread.currentThread();
		            if (getState() == RUNNING) { // recheck after setting thread
		                V result;
		                try {
							// 就是调用了mWorker.call方法
							// 把耗时操作得到的结果赋值给result
		                    result = callable.call();
		                } catch (Throwable ex) {
		                    setException(ex);
		                    return;
		                }
						// 转调了sync.innerSet(v);
		                set(result);
		            } else {
		                releaseShared(0); // cancel
		            }
		        }
	
		mWorker = new WorkerRunnable<Params, Result>() {
		            public Result call() throws Exception {
		                Process.setThreadPriority(Process.THREAD_PRIORITY_BACKGROUND);
						// 执行耗时操作 在子线程中执行
		                return doInBackground(mParams);
		            }
		        };

		protected void set(V v) {
				// 转调
		        sync.innerSet(v);
		    }

		void innerSet(V v) {
		            for (;;) {
		                int s = getState();
		                if (s == RAN)
		                    return;
		                if (s == CANCELLED) {
		                    // aggressively release to set runner to null,
		                    // in case we are racing with a cancel request
		                    // that will try to interrupt runner
		                    releaseShared(0);
		                    return;
		                }
		                if (compareAndSetState(s, RAN)) {
		                    result = v;
		                    releaseShared(0);
							// 调用了FutureTask的抽象方法
		                    done();
		                    return;
		                }
		            }
		        }

		mFuture = new FutureTask<Result>(mWorker) {
            @Override
            protected void done() {
                Message message;
                Result result = null;

                try {
					// 转调了sync.innerGet()
                    result = get();
                } catch (InterruptedException e) {
                    android.util.Log.w(LOG_TAG, e);
                } catch (ExecutionException e) {
                    throw new RuntimeException("An error occured while executing doInBackground()",
                            e.getCause());
                } catch (CancellationException e) {
                    message = sHandler.obtainMessage(MESSAGE_POST_CANCEL,
                            new AsyncTaskResult<Result>(AsyncTask.this, (Result[]) null));
                    message.sendToTarget();
                    return;
                } catch (Throwable t) {
                    throw new RuntimeException("An error occured while executing "
                            + "doInBackground()", t);
                }
				// 发送了一个Message
                message = sHandler.obtainMessage(MESSAGE_POST_RESULT,
                        new AsyncTaskResult<Result>(AsyncTask.this, result));
                message.sendToTarget();
            }
        };

		public V get() throws InterruptedException, ExecutionException {
				// 转调
		        return sync.innerGet();
		    }

		V innerGet() throws InterruptedException, ExecutionException {
		            acquireSharedInterruptibly(0);
		            if (getState() == CANCELLED)
		                throw new CancellationException();
		            if (exception != null)
		                throw new ExecutionException(exception);
					// 把之前doinBackground方法的结果返回
		            return result;
		        }
> #### 在AsyncTask的成员变量，创建了InternalHandler
    private static class InternalHandler extends Handler {
        @SuppressWarnings({"unchecked", "RawUseOfParameterizedType"})
        @Override
        public void handleMessage(Message msg) {
            AsyncTaskResult result = (AsyncTaskResult) msg.obj;
            switch (msg.what) {
                case MESSAGE_POST_RESULT:
                    // There is only one result
					// 结束耗时操作完成后的消息
					// 调用了AsyncTask的finish方法传递的result.mData[0]就是之前
					// 耗时操作返回来的结果
                    result.mTask.finish(result.mData[0]);
                    break;
                case MESSAGE_POST_PROGRESS:
                    result.mTask.onProgressUpdate(result.mData);
                    break;
                case MESSAGE_POST_CANCEL:
                    result.mTask.onCancelled();
                    break;
            }
        }
    }

    private static class AsyncTaskResult<Data> {
        final AsyncTask mTask;
        final Data[] mData;
		// data 是返回的结果
        AsyncTaskResult(AsyncTask task, Data... data) {
            mTask = task;
            mData = data;
        }
    }

    private void finish(Result result) {
        if (isCancelled()) result = null;
		// 耗时操作完成，更新UI，执行在主线程
        onPostExecute(result);
        mStatus = Status.FINISHED;
    }

