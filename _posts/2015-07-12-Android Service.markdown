---
layout:     post
title:      "Android Service "
subtitle:   " \"Android Service 你所需要知道的一切\""
date:       2015-07-05 12:00:00
author:     "Joe"
header-img: "img/post-bg-2015.jpg"
tags:
    - Android学习笔记
    - Service
    - 四大组件
    - 生命周期


---


## Android Service



Android中的服务Service，和Activity不同的是不能与用户交互的。Service和Activity都继承自ContextWrapp，（service是大爷）。Service启动之后就会在系统后台运行，当程序退出时，我们没有显示的调用停止服务，那么这个Service就没有结束，它仍然在后台运行。Service和其他组件一样，都是运行在主线程中，因此不能用它来做耗时的操作。

首先来了解进程优先级：
Android系统有一套 内存回收机制. 会根据优先级进行回收. 

Android系统会尽可能的维持程序的进程, 但是终究还是需要回收一些旧的进程节省内存提供给新的或者重要的进程使用.

进程优先级(由高到低):

1. Foreground process 前台进程 用户正在操作的应用程序的进程，用户正在交互。
* 这样的进程拥有一个在屏幕上显示并和用户交互的 activity 或者它的一个IntentReciver 正在运行。仅当内存实在无法供给它们维持同时运行时才会被杀死。一般来说，在这种情况下，设备依然处于使用虚拟内存的状态，必须要杀死一些前台进程以用户界面保持响应。
2. Visible process    可视进程  没有前台组件，用户可以看到, 但无法进行操作的应用程序的进程.
* 当满足如下任一条件时，进程被认为是可视的：
 *  它包含着一个不在前台，但仍然为用户可见的activity（它的onPause()方法被调用）。这种情况可能出现在以下情况：比如说，前台activity是一个对话框，而之前的Activity位于其下并可以看到。
 *  它包含了一个绑定至一个可视的activity的服务。
 可视进程依然被视为是很重要的，非到不杀死它们便无法维持前台进程运行时，才会被杀死。
3. Service process    服务进程  后台运行的服务所在的进程.（如果有Activity再前台，则该进程属于前台进程）。
* 服务进程是由startService() 方法启动的服务，它不会变成上述两类。尽管服务进程不会直接为用户所见，但它们一般都在做着用户所关心的事情（比如在后台播放mp3或者从网上下载东西）。所以系统会尽量维持它们的运行，除非系统内存不足以维持前台进程和可视进程的运行需要。
4. Background process 后台进程  最小化应用程序, 托管到后台运行.
* 一般包含目前不为用户所见的activity（Activity对象的onStop() 方法已被调用）。这些进程与用户体验没有直接的联系，可以在任意时间被杀死以回收内存供前台进程、可视进程以及服务进程使用。
5. Empty process     空进程    已经退出的程序, 没有任务在运行.
* 不包含任何活动应用程序组件。这种进程存在的唯一原因是做为缓存以改善组件再次于其中运行时的启动时间。系统经常会杀死这种进程以保持进程缓存和系统内核缓存之间的平衡

注1：在Service中新开线程和直接新开线程的区别

（1）若我们直接在Activity中新开一条线程来做耗时操作，当该Activity退出到桌面或其他情况时将成为一个背景进程。
（2）若我们在Service中新启动线程，则此时Android会依据进程中当前活跃组件重要程度，将其判断为服务进程，优先级比（1）高。

注2：Thread和Service的区别：

- 1）Thread 是程序执行的最小单元，它是分配CPU的基本单位，可以用 Thread 来执行一些异步的操作。
如果是Local Service，那么对应的 Service 是运行在主进程的 main 线程上的。如果是Remote Service，那么对应的 Service 则是运行在独立进程的main 线程上。因此 Service不是线程！
- 2）Thread 的运行是独立于 Activity 的，也就是说当一个 Activity 被 finish 之后，如果你没有主动停止Thread 或者Thread 里的 run 方法没有执行完毕的话，Thread 也会一直执行。因此这里会出现一个问题：当 Activity 被 finish 之后，你不再持有该 Thread 的引用。另一方面，你没有办法在不同的 Activity 中对同一 Thread 进行控制。
而任何 Activity 都可以控制同一 Service，而系统也只会创建一个对应 Service 的实例。因此你可以把 Service 想象成一种消息服务，而你可以在任何有 Context 的地方调用 Context.startService、Context.stopService、Context.bindService，Context.unbindService，来控制它，你也可以在 Service 里注册 BroadcastReceiver，在其他地方通过发送 broadcast 来控制它，当然这些都是 Thread 做不到的。
- 3) Service组件主要有两个目的：后台运行和跨进程访问。service可以在android系统后台独立运行，线程是不可以。
- 4) Service类是可以供其他应用程序来调用这个Service的而Thread只是在本类中在使用，如果本类关闭 那么这个thread也就下岗了而Service类则不会.

#### 服务两种启动方式

* startService
    * 第一次启动执行onCreate和onStartCommand（onStart已过时）方法，重复的调用startService会导致onStartCommand被重复调用
	* 该方法启动的服务所在的进程属于服务进程，服务可以在设置页面看到
	* 服务被启动之后，跟启动它的组件没有关系
	* Activity一旦启动服务，服务跟Activity没有任何关系，就会长期运行，除非手动停止
	* startService启动服务的生命周期
 onCreate-onStartCommand-onDestroy

```
			//点击按钮 开启服务  通过startservice 
			public void click1(View v) {
			Intent intent = new Intent(this,DemoService.class);
			startService(intent); //开启服务 
			}
			//关闭服务
			public void click2(View v) {
			Intent intent = new Intent(this,DemoService.class);
			stopService(intent);//关闭服务
			}

```


Service启动后，就会一直运行于后台，直到调用`Context.stopService()`或`stopSelf()`方法，才会调用`onDestroy()`方法销毁Service实例；而且Service还可以根据`onStartCommand()`方法的返回值来决定这个Serivice的运行模式：
`START_STICKY`,如果这个Service在执行完`onStartCommand()`方法后，被系统杀掉，保留这个Service为开始状态，但不保留Intent对象，因此如果后面没有新的Intent对象传进来，则系统会用null的Intent对象来，调用`onStartCommand()`方法重新创建该Service实例；
`START_NOT_STICKY`如果这个Serice在执行完`onStartCommand()`方法后，被系统杀掉，那么这个Service实例不会立刻重新创建，直到有接收到新的`Context.startService(Intent)`,会根据新的Intent来重新创建Service的实例(如果Intent为空，则不会创建)；如在做网络相关的工作时；
`START_REDELIVER_INTENT`，如果这个Service在执行完`onStartCommand()`方法后，被杀掉，则系统会用最后传给Service的Intent对象来执行`onStartCommand()`方法创建这个Service实例，适用于立即恢复正在进行的工作，如下载；


* bindService
    * 第一次执行 onCreate和onBind方法，且只绑定一次，继续点击Service不会响应，onBind方法返回null时不执行`onServiceDisconnected()`方法
	* 该方法启动的服务所在进程不属于服务进程，相当于是隐形服务，不能在设置页面看到
	*  **如果Activity与服务建立连接，Activity一旦退出，服务也会销毁**。（注意Activity销毁时要解绑`unbindService()`,否则出现ServiceConnectionLeaked）	
	* 不能多次解绑，否则会出现异常
	*  绑定服务和解绑服务的生命周期方法：onCreate->onBind->onUnbind->onDestroy
	*  通过unbindService()函数取消绑定Servcie时，onUnbind()函数将被调用，如果onUnbind()函数的返回true，则表示在调用者绑定新服务时， onRebind()函数将被调用
	*  取消绑定仅需要使用unbindService()方法，并将ServiceConnnection传递给unbindService()方法需注意的是，unbindService()方法成功后，系统正常情况并不会调用onServiceDisconnected()，因为onServiceDisconnected()仅在意外断开绑定时才被调用。
	*  当bindService后，不能stopService,需要通过unBindService()来解除绑定；startService()后，不可以通过unBindService()来销毁service



```
			//点击按钮 绑定服务 开启服务的第二种方式  
			public void click3(View v){
			Intent intent = new Intent(this,DemoService.class);
			//连接到DemoService 这个服务 
			conn = new MyConn();
			bindService(intent,conn , BIND_AUTO_CREATE);
			}
			//点击按钮手动解绑服务
			public void click4(View v){
				unbindService(conn);
			}
			@Override
			protected void onDestroy() {
			//当Activity销毁的时候 要解绑服务 
				unbindService(conn);
				super.onDestroy();
			}
			//定义一个类 用来监视服务的状态 
			private class MyConn implements ServiceConnection{
				@Override     //当服务连接成功调用
			public void onServiceConnected(ComponentName name, IBinder service) {
					System.out.println("onServiceConnected");	
				}		
				@Override    //失去连接调用
			public void onServiceDisconnected(ComponentName name) {		
				}	
			}
```

##### 两种启动方法混合使用

* 用服务实现音乐播放时，因为音乐播放必须运行在服务进程中，可是音乐服务中的方法，需要被前台Activity所调用，所以需要混合启动音乐服务
* 先start，再bind，销毁时先unbind，在stop


###### 如何保证Service杀不死？

充分利用onStartCommand()方法的返回值；
在Service的onDestory中重启该Service；
动态注册一个广播，在广播里重启该Service；

-------------

##### 电话窃听器

* 电话状态：空闲、响铃、接听
* 获取电话管理器，设置侦听

```
		TelephonyManager tm = (TelephonyManager) getSystemService(TELEPHONY_SERVICE);
		tm.listen(new MyPhoneStateListener(), PhoneStateListener.LISTEN_CALL_STATE);
```

* 侦听对象的实现

```
		class MyPhoneStateListener extends PhoneStateListener{

			//当电话状态改变时，此方法调用
			@Override
			public void onCallStateChanged(int state, String incomingNumber) {
				// TODO Auto-generated method stub
				super.onCallStateChanged(state, incomingNumber);
				switch (state) {
				case TelephonyManager.CALL_STATE_IDLE://空闲
					if(recorder != null){
						recorder.stop();
						recorder.release();
					}
					break;
				case TelephonyManager.CALL_STATE_OFFHOOK://摘机
					if(recorder != null){
						recorder.start();
					}
					break;
				case TelephonyManager.CALL_STATE_RINGING://响铃
					recorder = new MediaRecorder();
					//设置声音来源
					recorder.setAudioSource(MediaRecorder.AudioSource.MIC);
					//设置音频文件格式
					recorder.setOutputFormat(MediaRecorder.OutputFormat.THREE_GPP);
					recorder.setOutputFile("sdcard/haha.3gp");
					//设置音频文件编码
					recorder.setAudioEncoder(MediaRecorder.AudioEncoder.AMR_NB);
					try {
						recorder.prepare();
					} catch (IllegalStateException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					} catch (IOException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					break;
				}
			}
		}
```

-----------------

#### Service 生命周期

![img](/img/in-post/2015-07-12-Android Service/2015-07-12-Android Service-2.png)

![img](/img/in-post/2015-07-12-Android Service/2015-07-12-Android Service-1.png)



##### 调用服务的分类

* 本地服务：指的是启动服务的activity和服务在同一个进程中
* 远程服务：指的是启动服务的activity和服务不在同一个进程中

#### 通过bindService方法调用服务里的方法


```
	public class MainActivity extends Activity {
	private MyConn conn;
	private MyBinder myBinder;//定义的中间联系对象
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);
		Intent intent = new Intent(this,MyService.class);
		//连接服务 
		conn = new MyConn();
		bindService(intent, conn, BIND_AUTO_CREATE);	
	}
	//点击按钮调用服务里面办证的方法
	public void click(View v) {	
		myBinder.callmethod(1000);	
	}
	//监视服务的状态
	private class MyConn implements ServiceConnection{
		//当服务连接成功调用
		@Override
		public void onServiceConnected(ComponentName name, IBinder service) {
			//获取中间人对象
			myBinder = (MyBinder) service;	
		}
		//失去连接
		@Override
		public void onServiceDisconnected(ComponentName name) {		
		}
	}	
	@Override
	protected void onDestroy() {
		//当activity 销毁的时候 解绑服务 
		unbindService(conn);
		super.onDestroy();
		}
	}

```

-----------

```
	
	public class MyService extends Service {
	//把定义的中间联系对象返回 
	@Override
	public IBinder onBind(Intent intent) {
		return new MyBinder();
	}
	//定义服务里的方法
	public void method(int money){
		if (money>1000) {
			Toast.makeText(getApplicationContext(), "大于1000", 1).show();
		}else {
			Toast.makeText(getApplicationContext(), "不大于1000", 1).show();
		}
	}
	//[1]定义中间联系对象(IBinder)
	public class MyBinder extends Binder{	
		public void callmethod(int money){
			//调用服务里的方法
			method(money);
			}	
		}		
	}
```

----------

### 跨应用启动服务

* android 5.0 之后只能显式意图启动服务，不能用隐式Intent



```
//Context pkg 包名  Class cls 类名
        Intent intent = new Intent();
        intent.setComponent(new ComponentName(Context pkg,Class cls));
        startService(intent);
```




---------------



#### IntentService

IntentService是Service用来处理异步请求的一个子类，在Service里的操作默认是运行在主线程中的，而IntentService会重新生成一个工作线程，来处理需要Service处理的操作，这个操作并不会影响UI主线程正常工作。需要的时候，通过startService(intent)来启动一个IntentService，当IntentService的工作线程里的所有Intent都被处理完后，这个IntentService会自动停止运行。

新建一个类继承自IntentService，然后重写onHandleIntent(Intent)方法，就可以在程序里使用这个IntentService来处理Intents。处理的时候，每次都从工作线程里取出一个Intent对象让IntentService对象处理，直到工作线程为空时，这个IntentService对象就会销毁；

```
	public class MyIntentService extends IntentService {
    public MyIntentService(){
        super("myintentService");  //命名
    }
    @Override
    protected void onHandleIntent(Intent intent) {
        Log.i("MyServcie", "onHandleIntent" + Thread.currentThread().getId());
        try {
            Thread.sleep(20000);
        } catch (InterruptedException e) {
            e.printStackTrace();
	        }
	    }
	}
```

------------------