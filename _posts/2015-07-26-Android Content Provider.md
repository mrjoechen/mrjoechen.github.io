---
layout:     post
title:      "Android Content Provider "
subtitle:   " \"Android Content Provider 你所需要知道的一切\""
date:       2015-07-26 12:00:00
author:     "Joe"
header-img: "img/post-2016-high.jpg"
tags:
    - Android学习笔记
    - Content Provider
    - 四大组件
    - 生命周期
    - 内容提供者


---

## Android Content Provider



###### 内容提供者

* 四大组件之一
* 应用的数据库是不允许其他应用访问的，内容提供者的作用：把私有数据暴露给其他应用，通常把私有数据库的数据暴露给其他应用使用。
* 自定义内容提供者，继承ContentProvider类，重写增删改查方法，在方法中实现增删改查数据库的功能。
* 在清单文件manifest中定义内容提供者的标签，注意必须要有authorities属性，这是内容提供者的主机名，功能类似地址

		<provider android:authorities="应用包名"
		android:name="自定义ContentProvider类"       
        android:exported="true"
         ></provider>


###### ContentProvider实现数据访问

当应用继承ContentProvider类，并重写该类用于提供数据和存储数据的方法，就可以向其他应用共享其数据。

 * `onCreate ()` 只有当存在ContentResolver 尝试访问我们程序中的数据时，内容提供器才会被初始化。当应用第一次访问时被调,初始化一个provider,只能在应用主线程中调用。
 * `insert ()`	外部应用使用此方法添加数据。
 * `delete()`	外部应用使用此方法删除数据。
 * `update()`	外部应用使用此方法更新数据。
 * `query()`	外部应用使用此方法查询数据。

 * `getType()` 主要用于匹配数据类型，返回当前Uri所代表数据的MIME类型。如果操作的数据属于集合类型，那么MIME类型字符串应该以vnd.android.cursor.dir/自定义类型。数据属于非集合类型数据，应该返回vnd.android.cursor.item/自定义类型。

 * `UriMatcher	`用于匹配Uri
 * `ContentUris`	获取和添加Uri信息


##### URI

URI：统一资源标识符，代表要操作的数据，可以用来标识每个ContentProvider，这样你就可以通过指定的URI找到想要的ContentProvider,从中获取或修改数据。
ContentProvider   URI
![img](/img/in-post/2015-07-26-Android Content Provider/2015-07-26-Android Content Provider.png)

1：schema，用来说明一个ContentProvider控制这些数据。 "content://"
2：主机名或授权（Authority），它定义了是哪个ContentProvider提供这些数据。
3：path路径，URI下的某一个Item。
4：ID, 通常定义Uri时使用”#”号占位符代替, 使用时替换成对应的数字
"content://com.cskaoyan.provider/userinfo/#" #表示数据id（#代表任意数字）
"content://com.cskaoyan.provider/userinfo/*" *来匹配任意文本

___


##### UriMatcher

* 用于判断一条uri跟指定的多条uri中的哪条匹配
* 添加匹配规则
		
		
		// 第一步：获取匹配器  （常量UriMatcher.NO_MATCH表示不匹配任何路径的返回码）
	    UriMatcher  um= new UriMatcher(UriMatcher.NO_MATCH);
		//指定多条uri,添加需要匹配uri，如果匹配就会返回匹配码
		um.addURI("com.chenqiao.person", "person", PERSON_CODE);
		um.addURI("com.chenqiao.person", "company", COMPANY_CODE);
		//#号为通配符，可以代表任意数字
		um.addURI("com.chenqiao.person", "person/#", QUERY_ONE_PERSON_CODE);
* 通过Uri匹配器可以实现操作不同的表

			
			@Override
			//第二步注册完需要匹配的Uri后，就可以使用um.match(uri)方法对输入的Uri进行匹配，如果匹配就返回匹配，匹配码是调用addURI()方法传入的第三个参数，假设匹配content://cn.cskaoyan.provider.personprovider/person路径，返回的匹配码为 PERSON_CODE
	      //  在对应的操作中获取调用者传来的uri，并解析对应的匹配码
		public Uri insert(Uri uri, ContentValues values) {
			if(um.match(uri) == PERSON_CODE){
				db.insert("person", null, values);
			}
			else if(um.match(uri) == COMPANY_CODE){
				db.insert("company", null, values);
			}
			else{
				throw new IllegalArgumentException();
			}
			return uri;
		}
* 如果路径中带有数字，把数字提取出来的api

		int id = (int) ContentUris.parseId(uri);


---

##### ContentUris类使用介绍

ContentUris类用于获取Uri路径后面的ID部分，它有两个比较实用的方法：
withAppendedId(uri, id)用于为路径加上ID部分：
		
		Uri uri = Uri.parse("content://cn.chenqiao.provider.personprovider/person")
		Uri resultUri = ContentUris.withAppendedId(uri, 10); 
		//生成后的Uri为：content://cn.cskaoyan.provider.personprovider/person/10
parseId(uri)方法用于从路径中获取ID部分：
		
		Uri uri = Uri.parse("content://cn.cskaoyan.provider.personprovider/person/10")
		long personid = ContentUris.parseId(uri);//获取的结果为:10

另外Uri类中还有一个静态方法withAppendedPath(baseUri, pathSegment)也可以在某个路径上继续添加路径:
		
		Uri uri = Uri.parse("content://cn.cskaoyan.provider.personprovider/person")
		Uri resultUri = Uri.withAppendedPath(uri, “name”);
		// 生成后的Uri为: content://cn.cskaoyan.provider.personprovider/person/name
		uri.getPathSegments().get(int); 可以获取添加的路径
		String path0 =  uri.getPathSegments().get(0); // 获取结果path0为person
		 String path1 =  uri.getPathSegments().get(1); // 获取结果path1为name
		 
-------

##### 短信数据库

* 只需要关注sms表
* 只需要关注4个字段
	* body：短信内容
	* address:短信的发件人或收件人号码
	* date：短信时间
	* type：1为收到，2为发送
* 读取系统短信，首先查询源码获得短信数据库内容提供者的主机名和路径，然后

		ContentResolver cr = getContentResolver();
		Cursor c = cr.query(Uri.parse("content://sms"), new String[]{"body", "date", "address", "type"}, null, null, null);
		while(c.moveToNext()){
			String body = c.getString(0);
			String date = c.getString(1);
			String address = c.getString(2);
			String type = c.getString(3);
			System.out.println(body+";" + date + ";" + address + ";" + type);
		}

* 插入系统短信

		ContentResolver cr = getContentResolver();
		ContentValues cv = new ContentValues();
		cv.put("body", "您尾号为XXXX的招行储蓄卡收到转账1,000,000人民币");
		cv.put("address", 95555);
		cv.put("type", 1);
		cv.put("date", System.currentTimeMillis());
		cr.insert(Uri.parse("content://sms"), cv);
* 插入查询系统短信需要注册权限

---

##### 联系人数据库

* raw\_contacts表：
	* contact_id：联系人id
* data表：联系人的具体信息，一个信息占一行
	* data1：信息的具体内容
	* raw\_contact_id：联系人id，描述信息属于哪个联系人
	* mimetype_id：描述信息是属于什么类型
* mimetypes表：通过mimetype_id到该表查看具体类型

###### 读取联系人

* 先查询raw\_contacts表拿到联系人id

		Cursor cursor = cr.query(Uri.parse("content://com.android.contacts/raw_contacts"), new String[]{"contact_id"}, null, null, null);
* 然后拿着联系人id去data表查询属于该联系人的信息

		Cursor c = cr.query(Uri.parse("content://com.android.contacts/data"), new String[]{"data1", "mimetype"}, "raw_contact_id = ?", new String[]{contactId}, null);
* 得到data1字段的值，就是联系人的信息，通过mimetype判断是什么类型的信息

		while(c.moveToNext()){
			String data1 = c.getString(0);
			String mimetype = c.getString(1);
			if("vnd.android.cursor.item/email_v2".equals(mimetype)){
				contact.setEmail(data1);
			}
			else if("vnd.android.cursor.item/name".equals(mimetype)){
				contact.setName(data1);
			}
			else if("vnd.android.cursor.item/phone_v2".equals(mimetype)){
				contact.setPhone(data1);
			}
		}

###### 插入联系人

* 先查询raw\_contacts表，确定新的联系人的id应该是多少
* 把确定的联系人id插入raw\_contacts表

		cv.put("contact_id", _id);
		cr.insert(Uri.parse("content://com.android.contacts/raw_contacts"), cv);
* 在data表插入数据
	* 插3个字段：data1、mimetype、raw\_contact_id
		
			cv = new ContentValues();
			cv.put("data1", "赵六");
			cv.put("mimetype", "vnd.android.cursor.item/name");
			cv.put("raw_contact_id", _id);
			cr.insert(Uri.parse("content://com.android.contacts/data"), cv);
			
			cv = new ContentValues();
			cv.put("data1", "1596874");
			cv.put("mimetype", "vnd.android.cursor.item/phone_v2");
			cv.put("raw_contact_id", _id);
			cr.insert(Uri.parse("content://com.android.contacts/data"), cv);

-----

#### 内容观察者

* 当数据库数据改变时，内容提供者会发出通知，在内容提供者的uri上注册一个内容观察者，就可以收到数据改变的通知

		cr.registerContentObserver(Uri.parse("content://sms"), true, new MyObserver(new Handler()));
		
		class MyObserver extends ContentObserver{

			public MyObserver(Handler handler) {
				super(handler);
				// TODO Auto-generated constructor stub
			}
	
			//内容观察者收到数据库发生改变的通知时，会调用此方法
			@Override
			public void onChange(boolean selfChange) {

			}
		
		}
* 在内容提供者中发通知的代码

		ContentResolver cr = getContext().getContentResolver();
		//发出通知，所有注册在这个uri上的内容观察者都可以收到通知
		cr.notifyChange(uri, null);

