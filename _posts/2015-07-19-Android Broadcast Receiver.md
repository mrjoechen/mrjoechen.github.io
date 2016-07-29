---
layout:     post
title:      "Android Broadcast Receiver "
subtitle:   " \"Android Broadcast Receiver 你所需要知道的一切\""
date:       2015-07-19 12:00:00
author:     "Joe"
header-img: "img/post-2016-sunsetglow.jpg"
tags:
    - Android学习笔记
    - 四大组件
    - 广播接收者
    - Broadcast Receiver


---


## Android Broadcast Receiver

#### 广播

Android：系统在产生某个事件时发送广播，应用程序使用广播接收者接收这个广播，就知道系统产生了什么事件。
Android系统在运行的过程中，会产生很多事件，比如开机、电量改变、收发短信、拨打电话、屏幕解锁


---------


  广播接收者（BroadcastReceiver）用于接收广播Intent, 广播Intent的发送是通过调用`sendBroadcast()`, `sendOrderedBroadcast()`来实现的. 通常一个广播Intent可以被注册了此Intent的多个广播接收者所接收. 
要实现一个广播接收者方法如下：


* 第一步：继承BroadcastReceiver，并重写onReceive()方法。


	
		public class IncomingSMSReceiver extends BroadcastReceiver {
		@Override 
		public void onReceive(Context context, Intent intent) {
			}
		}


* 第二步：注册要接受的广播Intent，注册方法有两种：


  * 第一种：在AndroidManifest.xml文件中的`<application>`节点里进行注册（静态注册：不管应用有没有在运行，安装即生效都可以收到广播。4.0之后，第一次安装应用必须产生界面才生效）:
```
	<receiver android:name=".IncomingSMSReceiver">
		    <intent-filter>
				         <action android:name="android.provider.Telephony.SMS_RECEIVED"/>
		    </intent-filter>
	</receiver>
```


  * 第二种：使用代码进行注册（动态注册 在注册的代码执行到之后才向系统注册，操作频繁的广播事件，例如锁屏解锁，电量变化，在清单文件里注册无效）
 
		IntentFilter filter = new IntentFilter("android.provider.Telephony.SMS_RECEIVED");
		IncomingSMSReceiver receiver = new IncomingSMSReceiver();
		registerReceiver(receiver, filter);


两种广播方式区别：
* 动态注册：必须Activity没有被销毁才能收到广播。本质上是broadcast没有被销毁。
* 静态注册：不管应用有没有在运行，都可以收到广播。

注：页面关闭时不要忘记unregisterReceiver(),否则会出现IntentReceiverLeaked


---

#### IP拨号器

> 原理：接收拨打电话的广播，修改广播内携带的电话号码


* 定义广播接收者接收打电话广播

		public class CallReceiver extends BroadcastReceiver {
		//当广播接收者接收到广播时，此方法会调用
		@Override
		public void onReceive(Context context, Intent intent) {
		//拿到用户拨打的号码
		String number = getResultData();
		//修改广播内的号码
		setResultData("17951" + number);
			}
		}
	
* 在清单文件中定义该广播接收者接收的广播类型

		<receiver android:name="com.chenqiao.ipdialer.CallReceiver">
            <intent-filter >
                <action android:name="android.intent.action.NEW_OUTGOING_CALL"/>
            </intent-filter>
        </receiver>
* 接收打电话广播需要权限

		<uses-permission android:name="android.permission.PROCESS_OUTGOING_CALLS"/>
* 即使广播接收者的进程没有启动，当系统发送的广播可以被该接收者接收时，系统会自动启动该接收者所在的进程


---

#### 监听SD卡状态

* 清单文件中定义广播接收者接收的类型，监听SD卡常见的三种状态，所以广播接收者需要接收三种广播

		 <receiver android:name="com.chenqiao.sdcradlistener.SDCardReceiver">
            <intent-filter >
                <action android:name="android.intent.action.MEDIA_MOUNTED"/>
                <action android:name="android.intent.action.MEDIA_UNMOUNTED"/>
                <action android:name="android.intent.action.MEDIA_REMOVED"/>
                <data android:scheme="file"/>
            </intent-filter>
        </receiver>

* 广播接收者的定义

		public class SDCardReceiver extends BroadcastReceiver {
			@Override
			public void onReceive(Context context, Intent intent) {
				// 区分接收到的是哪个广播
				String action = intent.getAction();
					
				if(action.equals("android.intent.action.MEDIA_MOUNTED")){
					System.out.println("sd卡就绪");
				}
				else if(action.equals("android.intent.action.MEDIA_UNMOUNTED")){
					System.out.println("sd卡被移除");
				}
				else if(action.equals("android.intent.action.MEDIA_REMOVED")){
					System.out.println("sd卡被拔出");
				}
			}
		}

---

#### 监听应用的安装、卸载、更新

> 原理：应用在安装卸载更新时，系统会发送广播，广播里会携带应用的包名


* 清单文件定义广播接收者接收的类型，因为要监听应用的三个动作，所以需要接收三种广播

		<receiver android:name="com.chenqiao.app.AppReceiver">
            <intent-filter >
                <action android:name="android.intent.action.PACKAGE_ADDED"/>
                <action android:name="android.intent.action.PACKAGE_REPLACED"/>
                <action android:name="android.intent.action.PACKAGE_REMOVED"/>
                <data android:scheme="package"/>
            </intent-filter>
        </receiver>

* 广播接收者的定义

		public void onReceive(Context context, Intent intent) {
			//区分接收到的是哪种广播
			String action = intent.getAction();
			//获取广播中包含的应用包名
			Uri uri = intent.getData();
			if(action.equals("android.intent.action.PACKAGE_ADDED")){
				System.out.println(uri + "被安装了");
			}
			else if(action.equals("android.intent.action.PACKAGE_REPLACED")){
				System.out.println(uri + "被更新了");
			}
			else if(action.equals("android.intent.action.PACKAGE_REMOVED")){
				System.out.println(uri + "被卸载了");
			}
		}

---

#### 广播的类型

* 无序广播：所有跟广播的intent匹配的广播接收者都可以收到该广播，并且是没有先后顺序（同时收到）,普通广播是完全异步的，可以在同一时刻（逻辑上）被所有接收者接收到，消息传递的效率比较高，但缺点是：接收者不能将处理结果传递给下一个接收者，并且无法终止广播Intent的传播.
* 有序广播：所有跟广播的intent匹配的广播接收者都可以收到该广播，但是会按照广播接收者的优先级来决定接收的先后顺序，另外，有序广播的接收者可以将数据传递给下一个接收者，如：A得到广播后，可以往它的结果对象中存入数据，当广播传给B时,B可以从A的结果对象中得到A存入的数据。优先级别声明在intent-filter元素的android:priority属性中，数越大优先级别越高,取值范围:-1000到1000，优先级别也可以调用IntentFilter对象的setPriority()进行设置 。
	* 优先级的定义：-1000~1000
	* 最终接收者：所有广播接收者都接收到广播之后，它才接收，并且一定会接收
	* abortBroadCast：阻止其他接收者接收这条广播，类似拦截，只有有序广播可以被拦截，广播Intent的传播一旦终止，后面的接收者就无法接收到广播。



		`Context.sendBroadcast()`
		   发送的是普通广播，所有注册者都有机会获得并进行处理。
		
		`Context.sendOrderedBroadcast()`
		   发送的是有序广播，系统会根据接收者声明的优先级别按顺序逐个执行接收者，前面的接收者有权终止广播(`BroadcastReceiver.abortBroadcast()`)，如果广播被前面的接收者终止，后面的接收者就再也无法获取到广播。对于有序广播，前面的接收者可以将数据通过setResultExtras(Bundle)方法存放进结果对象，然后传给下一个接收者，下一个接收者通过代码：`Bundle bundle = getResultExtras(true))`可以获取上一个接收者存入在结果对象中的数据。
		
		系统收到短信，发出的广播属于有序广播。如果想阻止用户收到短信，可以通过设置优先级，让你们自定义的接收者先获取到广播，然后终止广播，这样用户就接收不到短信了。


* sticky广播（粘性广播）


发送粘性广播需要权限 android.permission.BROADCAST_STICKY
如果发送广播的时候，还没有注册，发送的时候是无法收到的。
但是如果你在发送出去之后，才注册，系统会补发给你这个广播。
如：电池电量。

-----------

* 系统广播
系统发送--》 应用接收。

* 自定义广播
应用发送--》另一个应用也可以接收。

##### 自定义广播

1) 创建需要启动BroadcastReceiver的Intent。
2) 调用Context的sendBroadcast()或sendOrderedBroadcast()方法来启动指定的BroadcastReceiver。其中sendBroadcast发送的是普通广播，sendOrderedBroadcast发送的是有序广播。
当应用发出一个Broadcast Intent之后所匹配该Intent的组件都可能被启动。


##### 广播权限：

* 如果发送个广播的时候，指定了接收者需要具备的权限，则接收者必须要拥有该权限才可以接受。否则会报如下异常:

	**W/BroadcastQueue: Permission Denial: receiving Intent { act=com.chenqiao.myownorderedbroadcast flg=0x10 (has extras) } to com.chenqiao.mybroadcastreceiver/.MyReceiver1 requires com.chenqiao.pemissionrecv due to sender com.chenqiao.broadcastdemo (uid 10053)**

* 如果接收者定义了一个权限，该权限指明谁有权限发给我，则发送者必须具备该权限才可以发广播给我。否则会报如下异常:

	**W/BroadcastQueue: Permission Denial: broadcasting Intent { act=com.chenqiao.myownorderedbroadcast flg=0x10 (has extras) } from com.chenqiao.day15_broadcastdemo (pid=2929, uid=10053) requires com.chenqiao.sendpermission due to receiver com.chenqiao.day15_mybroadcastreceiver/.MyReceiver1**


*******************************


