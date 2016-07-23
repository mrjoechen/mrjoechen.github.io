---
layout:     post
title:      "Android 入门 "
subtitle:   " \"Android 基础知识\""
date:       2015-06-30 12:00:00
author:     "Joe"
header-img: "img/post-2015-sea.jpg"
tags:
    - Android学习笔记
    - Android基础


---

## Android 入门

#### Android 四层体系结构

![img](/img/in-post/2015-06-30-Android-Base/2015-06-30-Android-Base-1.png)

####  Dalvik  VM与JVM区别

![img](/img/in-post/2015-06-30-Android-Base/2015-06-30-Android-Base-2.png)

Dalvik: 应用每次运行时，字节码都需要通过即时编译转换为机器码这样会拖慢应用的运行效率。
ART：应用在第一次安装的时候，字节码就会预先编译为机器码 ，使之成为真正的本地应用，所以应用的启动速度和执行速度都会显著快一些。
 缺点：占用空间大些。

#### Android应用程序打包与安装过程

![img](/img/in-post/2015-06-30-Android-Base/2015-06-30-Android-Base-3.png)

编译 classes.dex 文件
ADB (android debug bridge) 为开发人员提供便利

#### 安装路径

* 第三方应用保存路径：data/app
* 系统应用保存路径：system/app
* data/data/包名文件夹：系统为每一个应用提供的一个专属空间


#### 常见ABD命令

* adb devices 列出所有的设备
* adb start-server 开启adb服务
* adb kill-server	关闭adb服务
* adb logcat	查看Log
* adb shell	挂载到Linux的空间 
* adb install <应用程序(加扩展名)> 	安装应用程序
* adb –s <模拟器名称>  install  <应用程序(加扩展名)>  安装应用到指定模拟器
* adb uninstall <程序包名>
* adb pull <remote> <local> 
* adb push <local> <remote>
* emulator –avd <模拟器名称>
* ps：查看运行进程
* ls：查看当前目录下的文件结构
* netstat -ano：查看占用端口的进程

----------

#### Android项目的目录结构

* Activity：应用被打开时显示的界面
* src：项目代码
* R.java：项目中所有资源文件的资源id
* Android.jar：Android的jar包，导入此包方可使用Android的api
* libs：导入第三方jar包
* assets：存放资源文件，比方说mp3、视频文件
* bin：存放编译打包后的文件
* res：存放资源文件，存放在此文件夹下的所有资源文件都会生成资源id
* drawable：存放图片资源
* layout：存放布局文件，把布局文件通过资源id指定给activity，界面就会显示出该布局文件定义的布局
* menu：定义菜单的样式
* Strings.xml：存放字符串资源，每个资源都会有一个资源id

#### Logcat

##### 等级

* verbose：冗余，最低等级
* debug：调试
* info：正常等级的信息
* warn：警告
* error：错误

---------------

#### 电话拨号器
>功能：用户输入一个号码，点击拨打按钮，启动系统打电话的应用把号码拨打出去


##### 1. 定义布局

1. 组件必须设置宽高，否则不能通过编译

		android:layout_width="wrap_content"
        android:layout_height="wrap_content"

2. 如果要在java代码中操作某个组件，则组件需要设置id，这样才能在代码中通过id拿到这个组件

		android:id="@+id/et_phone"

##### 2. 给按钮设置点击侦听

		 //通过id拿到按钮对象
        Button bt_call = (Button) findViewById(R.id.bt_call);
        //给按钮设置点击
        bt_call.setOnClickListener(new MyListener());

##### 3. 得到用户输入的号码

		//得到用户输入的号码，先拿到输入框组件
		EditText et_phone = (EditText) findViewById(R.id.et_phone);
		String phone = et_phone.getText().toString();

##### 4. 把号码打出去

1. Android系统中基于动作机制，来调用系统的应用，你告诉系统你想做什么动作，系统就会把能做这个动作的应用给你，如果没有这个应用，会抛异常
2. 设置动作，通过意图告知系统

		//把号码打出去
			//先创建一个意图对象
			Intent intent = new Intent();
			//设置动作，打电话
			intent.setAction(Intent.ACTION_CALL);
			intent.setData(Uri.parse("tel:" + phone));
			//把意图告诉系统
			startActivity(intent);

3. 添加权限

		<uses-permission android:name="android.permission.CALL_PHONE"/>

----------

#### 点击事件的四种写法

##### 第一种

* 定义一个MyListener实现onClickListener接口

		Button bt1 = (Button) findViewById(R.id.bt1);
        bt1.setOnClickListener(new MyListener());

##### 第二种
* 定义一个匿名内部类实现onClickListener接口

		Button bt2 = (Button) findViewById(R.id.bt2);
        bt2.setOnClickListener(new OnClickListener() {
			
			@Override
			public void onClick(View v) {
				System.out.println("第二种");
				
			}
		});

##### 第三种

* 让当前activity实现onClickListener接口

		Button bt3 = (Button) findViewById(R.id.bt3);
        bt3.setOnClickListener(this);

##### 第四种

* 给Button节点设置onClick属性，

		 android:onClick="click"
 
* 然后在activity中定义跟该属性值同名的方法

		public void click(View v){
			System.out.println("第四种");
		}

--------

#### 短信发送器
> 功能：用户输入号码和短信内容，点击发送按钮，调用短信api把短信发送给指定号码


##### 1. 定义布局

* 输入框的提示

		android:hint="请输入号码" 
 
##### 2. 完成点击事件

* 先给Button组件设置onClick属性
* 
		onClick="send"
* 在Activity中定义此方法


		public void send(View v){}


##### 3. 获取到用户输入的号码和内容

		EditText et_phone = (EditText) findViewById(R.id.et_phone);
    	EditText et_content = (EditText) findViewById(R.id.et_content);
    	String phone = et_phone.getText().toString();
    	String content = et_content.getText().toString();


##### 4. 调用发送短信的api

		//调用发送短信的api
    	SmsManager sm = SmsManager.getDefault();
    	
    	//发送短信
    	sm.sendTextMessage(phone, null, content, null, null);

* 添加权限

		 <uses-permission android:name="android.permission.SEND_SMS"/>

* 如果短信过长，需要拆分

		List<String> smss = sm.divideMessage(content);

----------

#### 文件

##### 文件访问权限

* 在Android中，每一个应用，都是一个独立的用户
* 使用10个字母表示
* drwxrwxrwx
* 第一个字母：
	* d：表示文件夹
	* -：表示文件
* 第一组rwx：表示的是文件拥有者（owner）对文件的权限
	* r：read，读
	* w：write
	* x：execute
* 第二组rwx：表示的是跟文件拥有者属于同一用户组的用户（grouper）对文件的权限
* 第三组rwx：表示的其他用户（other）对文件的权限


##### openFileOutput的四种模式


* MODE_PRIVATE：-rw-rw----
* MODE_APPEND:-rw-rw----
* MODE_WORLD_WRITEABLE:-rw-rw--w-
* MODE_WORLD_READABLE:-rw-rw-r--

##### 读文件

如果要打开存放在/data/data/package name/files目录应用私有的文件，可以使用Activity提供openFileInput()方法。
对于私有文件只能被创建该文件的应用访问，如果希望文件能被其他应用读和写，可以在创建文件时，指定Context.MODE_WORLD_READABLE和Context.MODE_WORLD_WRITEABLE权限。
或者直接使用文件的绝对路径：

	File file = new File("/data/data/com.cskaoyan/files/test.txt");
	FileInputStream inStream = new FileInputStream(file);

Activity还提供了getCacheDir()和getFilesDir()方法：
getCacheDir()方法用于获取/data/data/package name/cache目录
getFilesDir()方法用于获取/data/data/package name/files目录

	//读文件到内存	
	FileInputStream inStream = this.getContext().openFileInput("test.txt");
	Log.i("FileTest", readInStream(inStream));
	public static String readInStream(FileInputStream inStream){
	try {
		ByteArrayOutputStream outStream = new ByteArrayOutputStream();
		byte[] buffer = new byte[1024];
		int length = -1;
		while((length = inStream.read(buffer)) != -1 ){
			outStream.write(buffer, 0, length);//写到内存
		}
		outStream.close();
		inStream.close();
		return outStream.toString();
	} catch (IOException e) {
		Log.i("FileTest", e.getMessage());
	}
	return null;
	}

##### 写文件

		String path = context.getFilesDir().getPath();//保存到应用包名加下files文件夹中，系统自动生成
		File file = new File(path,"info.txt");
		String data = username + "##" +password;
		FileOutputStream fileoutputstream = new FileOutputStream(file);
		fileoutputstream.write(data.getbytes());
		fileoutputstream .close;

##### 或者：

在上下文中有一个方法叫openFileOutput()方法可以用于把数据输出到文件中，具体的实现过程与在J2SE环境中保存数据到文件中是一样的。
			
		//通过上下文获取FileOutputStream
	 FileOutputStream outStream = this.openFileOutput("cskaoyan.txt", Context.MODE_PRIVATE);
     outStream.write("王道论坛".getBytes());
     outStream.close();   

openFileOutput()方法的第一参数用于指定文件名称，不能包含路径分隔符“/” ，如果文件不存在，Android会自动创建它。创建的文件保存在/data/data/package name/files目录，然后在File Explorer视图中展开/data/data/package name/files目录就可以看到该文件。
openFileOutput()方法的第二参数用于指定操作模式，有四种模式，分别为： 
     
     Context.MODE_PRIVATE    =  0
     Context.MODE_WORLD_READABLE =  1
     Context.MODE_WORLD_WRITEABLE =  2
     Context.MODE_APPEND    =  32768

Context.MODE_PRIVATE：为默认操作模式，代表该文件是私有数据，只能被应用本身访问，在该模式下，写入的内容会覆盖原文件的内容，如果想把新写入的内容追加到原文件中，可以使用Context.MODE_APPEND
Context.MODE_APPEND：模式会检查文件是否存在，存在就往文件追加内容，否则就创建新文件。
Context.MODE_WORLD_READABLE和Context.MODE_WORLD_WRITEABLE用来控制其他应用是否有权限读写该文件。
MODE_WORLD_READABLE：表示当前文件可以被其他应用读取；MODE_WORLD_WRITEABLE：表示当前文件可以被其他应用写入。

如果希望文件被其他应用读和写，可以传入： 
openFileOutput("cskaoyan.txt", Context.MODE_WORLD_READABLE + Context.MODE_WORLD_WRITEABLE);

android有一套自己的安全模型，当应用程序(.apk)在安装时系统就会分配给他一个userid，当该应用要去访问其他资源比如文件的时候，就需要userid匹配。
默认情况下，任何应用创建的文件，sharedpreferences，数据库都应该是私有的（位于/data/data/package name/files），其他程序无法访问。除非在创建时指定了Context.MODE_WORLD_READABLE或者Context.MODE_WORLD_WRITEABLE ，只有这样其他程序才能正确访问。

     		
##### SD卡

* 存储设备会被分为若干个区块，每个区块有固定的大小
* 区块大小 * 区块数量 等于 存储设备的总大小

//这个字符串就是sd卡剩余容量
		formatSize(availableBlocks * blockSize) + readOnly
		//这两个参数相乘，得到sd卡以字节为单位的剩余容量
		availableBlocks * blockSize


	File externalStorageDirectory = Environment.getExternalStorageDirectory();
    StatFs tool = new StatFs(externalStorageDirectory.getAbsolutePath());
    //block  扇区
    long blockCountLong=0;
    long availableBlocksLong =0;
    long blockSizeLong=0;
    if(Build.VERSION.SDK_INT>=Build.VERSION_CODES.JELLY_BEAN_MR2){
    //当前用户的手机版本是大于APIlevel 18
         blockCountLong = tool.getBlockCountLong();
         availableBlocksLong = tool.getAvailableBlocksLong();
         blockSizeLong = tool.getBlockSizeLong();
        }else{
        blockCountLong = tool.getBlockCount();
        availableBlocksLong = tool.getAvailableBlocks();
        blockSizeLong = tool.getBlockSize();
        }
        //total
        long total = blockSizeLong*blockCountLong; //字节
        long avaiable = availableBlocksLong*blockSizeLong;
        String totalString = Formatter.formatFileSize(this, total);
        String avaiableString = Formatter.formatFileSize(this, avaiable);
        Log.i("sdcard",total/1024/1024+"");
        Log.i("sdcard",avaiable/1024/1024+"");


在程序中访问SDCard，你需要申请访问SDCard的权限。
// 写入外存储设备权限

	<android.permission.WRITE_EXTERNAL_STORAGE>
//写之前判断sd卡的状态
	
	Environment.getExternalStorageState().equals(Environment.MEDIA_MOUNTED)

##### 写文件到SD卡

		String data= username + "##" + pwd;
		// [1]创建file类指定我们要把数据存储的位置  把数据保存到sd卡
		String sdPath = Environment.getExternalStorageDirectory().getPath();
		File file = new File(sdPath,"123.txt");
		// [2]创建一个文件输出流
		FileOutputStream fos = new FileOutputStream(file);
		fos.write(data.getBytes());
		fos.close();		

##### SharedPreferences

为了保存软件的设置参数，Android 平台为我们提供了一个SharedPreferences 类，它是一个轻量级的存储类，适合用于保存软件配置参数。
使用SharedPreferences 保存数据，其背后是用xml文件存放数据，文件存放在/data/data/package name/shared_prefs 目录下。
获取SharedPreferences对象方法：

	SharedPreferences sp = getSharedPreferences("account", MODE_PRIVATE);
保存数据：
使用SharedPreferences保存key-value对的步骤如下：
1）获得SharedPreferences对象
2）获得SharedPreferences.Editor对象。
3）通过SharedPreferences.Editor接口的putXxx（）方法存放key-value对（其中Xxx表示不同的数据类型。如：字符串类型的value需要用putString（）方法）。
4）通过SharedPreferences.Editor接口的commit（）方法保存key-value对（commit方法相当于数据库事务中的提交（commit）操作）。
```
SharedPreferences.Editor editor = getSharedPreferences("data",
MODE_PRIVATE).edit();
editor.putString("name", "Tom");
editor.putInt("age", 28);
editor.putBoolean("married", false);
editor.commit();
```
读取数据信息:
1）打开名为account的配置文件

	SharedPreferences  sharedPreferences = getSharedPreferences(" account ", 0);
2）获取数据
		
	String name = sharedPreferences.getString("name","默认值");






