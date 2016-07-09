---
layout:     post
title:      "Android"
subtitle:   " \"Hello World, Hello Blog\""
date:       2016-07-09 12:00:00
author:     "Joe"
header-img: "img/post-bg-2015.jpg"
tags:
    - Android学习笔记
    - Activity
    - 四大组件
    - 生命周期
    - 数据传递
---

## Android Activity


### Android四大组件
* Activity
* BroadCastReceiver
* Service
* ContentProvider
注：* Android四大组件都要在清单文件中注册，（BroadCastReceiver例外可以动态
注册）

#### Activity
一个Activity是一个应用程序组件，提供一个屏幕，用户可以用来交互为了完成某项任务，例如拨号、拍照、发送email、看地图。每一个activity被给予一个窗口，在上面可以绘制用户交互的画面。窗口通常充满屏幕，但也可以小于屏幕而浮于其它窗口之上。一个用户交互界面对应一个activity,相当于是界面的容器`setContentView() `,// 要显示的布局activity 是Context的子类,同时实现了window.callback接口(里面方法如dispatchtouchevent可以分发事件)和keyevent.callback等, 可以处理与窗体用户交互的事件（为什么能交互）.
 ps.  Service也是context子类，是activity他大爷，没有实现一些可以交互的接口方法，所以不能和用户交互。

```
public class Activity extends ContextThemeWrapper
        implements LayoutInflater.Factory2,
        Window.Callback, KeyEvent.Callback,
        OnCreateContextMenuListener, ComponentCallbacks2,
        Window.OnWindowDismissedCallback {}
```

#### 创建activity

* 需要在清单文件中为其配置一个activity标签,声明你的activity在manifest文件为了它可以被系统访问。否则如果系统找不到，在显示时会直接报错ActivityNotFoundException。要声明你的activity，打开manifest文件，添加一个
* activity元素作为application元素的子元素。
* Activity 在调用的时候实例化，如果manifest没有声明这个activity，但不使用不会报
错。
* 如果Activity所在的包跟应用包名同名，那么可以省略不写。
* 标签中如果带有这个子节点，则会在系统中创建一个快捷图标


```
<intent-filter>
<action android:name="android.intent.action.MAIN" />
<category android:name="android.intent.category.LAUNCHER" />
</intent-filter>
```


* 声明入口activity，就会生成快捷图标，可以声明多个入口activity，会产生多个Activity对应的快捷图标。
* activity的名称label、图标icon可以和应用程序application节点的名称、图标不相同，但默认使用application节点下的属性


```
android:icon="@drawable/ic_launcher"
android:label="@string/app_name"
```


* 创建步骤：
1. 创建class类继承Activity
2. 创建布局文件，作为Activity的显示内容
3. 在清单文件中注册Activity



##### Activity的的跳转

>Activity的跳转需要创建Intent对象，通过设置intent对象的参数指定要跳转的activity
>通过设置Activity的包名和类名实现跳转，称为显式意图。
>通过指定动作实现跳转，称为隐式意图。

---


##### 显式意图
* 跳转至同一项目下的另一个Activity，直接指定该Activity的字节码即可


```
Intent intent = new Intent();
intent.setClass(this, SecondActivity.class);
startActivity(intent);
```

* 跳转至其他应用中的Activity，需要指定该应用的包名和该Activity的类名


```
Intent intent = new Intent();
//启动系统自带的拨号器应用
intent.setClassName("com.android.dialer","com.android.dialer.DialtactsActivity");
startActivity(intent);
```


##### 隐式意图
* 隐式意图跳转至指定Activity


```
Intent intent = new Intent();
//启动系统自带的拨号器应用
intent.setAction(Intent.ACTION_DIAL);
startActivity(intent);
```

* 要让一个Activity可以被隐式启动，需要在清单文件的activity节点中设置intent-filter子节点
 *   action 指定动作（可以自定义，可以使用系统自带的，可以使任意字符串，但一般写全类名）
 * data   指定数据（操作什么内容，包括URI和数据类型）
 * category 类别 （默认类别）


```
<intent-filter >
     <action android:name="com.chenqiao.second"/>
     <data android:scheme="chenqiao" android:mimeType="aa/bb"/>
     <category android:name="android.intent.category.DEFAULT"/>
</intent-filter>
```

* 隐式意图的属性设置


```
//[1]创建意图对象 意图就是我要完成一件事
Intent intent = new Intent();
//[2] 设置跳转的动作
intent.setAction("com.chenqiao.testactivity");
//[3] 设置category
intent.addCategory("android.intent.category.DEFAULT");
//[4]设置数据
// intent.setData(Uri.parse("chenqiao:"+110));
//[5]设置数据类型
//intent.setType("aa/bb");
//[6]注意 如果setdata 方法和 settype 方法一起使用的时候 应该使用下
面这个方法
intent.setDataAndType(Uri.parse("chenqiao:"+110), "aa/bb");
//[4]开启Activity
startActivity(intent);
```

对应的activity意图过滤器设置：

```
<intent-filter>
<action android:name="com.itheima.testactivity" />
<category android:name="android.intent.category.DEFAULT" />
<data android:mimeType="aa/bb" android:scheme="chenqiao" />
</intent-filter>
```

 * 隐式意图启动Activity，需要为intent设置以上三个属性，且值必须与该Activity在清单文件中对三个属性的定义匹配
 * intent-filter节点及其子节点都可以同时定义多个，隐式启动时只需与任意一个匹配即可
 * 在启动效率上，隐式远低于显示
 * 如果系统中存在多个Activity的intent-filter同时与你的intent匹配，那么系统会显示一个对话框，列出所有匹配的Activity，由用户选择启动哪一个。
 *  显式意图一般用于启动同一应用中的Activity
 *  隐式意图一般用于启动不同应用中的Activity，因为不能拿到另一个应用的activity类名，不能显示启动
 * 如果系统中存在多个Activity的intent-filter同时与你的intent匹配，那么系统会显示一个对话框，列出所有匹配的Activity，由用户选择启动哪一个


#### 意图匹配原则：
* `action行为检测`
> manifest文件中activity的一个intentfilter元素以子元素的形式列出了行为。例如：


```
<intent-filter . . . >
<action android:name="com.example.project.SHOW_CURRENT" />
<action android:name="com.example.project.SHOW_RECENT" />
<action android:name="com.example.project.SHOW_PENDING" />
. . .
</intent-filter>
```

> 如同示例所展示的，一个Intent对象只命名一个单独的行为，而一个过滤器可以列出多个行为。列表不能为空；一个过滤器至少要包含一个元素，否则它将屏蔽所有的意图。要通过这个检测，在Intent对象中指定的行为必须与过滤器所列出的行为之一相匹配。如果该对象或是过滤器没有指定一个行为，就会有下面的结果：如果过滤器没有列出任何行为，就没有行为可以与意图相匹配，所有的意图都无法通过检测。没有意图可以通过过滤器。另一方面，如果Intent对象没有指定任何的行为，它将自动通过检测——只要过滤器含有一个或以上的行为。

* `category类别检测`
>intent-filter也会将类别作为子元素列出。例如：


```
<intent-filter . . . >
<category android:name="android.intent.category.DEFAULT" />
<category android:name="android.intent.category.BROWSABLE" />
. . .
</intent-filter>
```

>注意之前描述过的表示行为和类型的常量不在mainfest文件中被使用。而是使用完整的字符串值。例如，在范例中的`“android.intent.category.BROWSABLE”`字符串和文档之前提到的`CATEGORY_BROWSABLE`常量相对应。类似地，字符串`“android.intent.action.EDIT”`和`ACTION_EDIT`常量相对应。
一个意图要通过类别检测，Intent对象中的每一个类别都必须与过滤器中的某个类别相匹配。过滤器可以列出其他更多的类别，但不能省略任何一个意图中含有的类别。
原则上，所以说，一个不含有类别的Intent对象，无论过滤器中有哪些类别，总是能够通过这项检测。这通常是正确的。不过，有一个例外，Android把所有传递给startActivity()的隐式意图视为它们包含了至少这样一个类别：`“android.intent.category.DEFAULT”`（CATEGORY_DEFAULT常量）。因此，要接受隐式意图的活动必须在其意图过滤器中包含有`“android.intent.category.DEFAULT”`。（设有`“android.intent.action.MAIN”`和`“android.intent.category.LAUNCHER”`的过滤器不在此范围之中。它们将活动标记为了新任务的开始，并显示在应用启动器（launcher）屏幕上。它们可以在类别列表中包含`“android.intent.category.DEFAULT”`，不过这并不是必须的）


* `data数据检测`
>如同行为和类别，意图过滤器的的数据类型也是作为子元素保存的。而且和它们一样，这些子元素可以出现多次或完全不出现。


```
<intent-filter . . . >
<data android:mimeType="video/mpeg" android:scheme="http" . . . />
<data android:mimeType="audio/mpeg" android:scheme="http" . . . />
. . .
</intent-filter>
```

>每一个元素可以指定一个URI和数据类型（MINE媒体类型）。URI的每一个部分由不同的属性——模式（scheme）、主机（host）、接口（port）和路径（path）。当一个Intent对象中的URI和过滤器中的URI相比较时，仅比较过滤器中所包含的URI部分。例如，如果一个过滤器仅指定了一个模式，那所有具有这个模式的URI就与过滤器相匹配。如果过滤器指定了一个模式及一个授权但是没有指定路径，那么无论是什么路径，具有相同模式和授权的URI将得到匹配。如果过滤器指定了模式、授权和路径，那就只有具有相同模式、授权和路径的URI得到匹配。不过，过滤器中指定的路径可以包含通配符以仅仅限定部分路径。
>一个data元素的类型（type）属性指定了数据的MINE类型。在过滤器中这比URI更为常见。Intent对象和过滤器都可以用””通配符作为子类别域来标识子类别匹配，例如“text/”或“audio/*”。
> * 数据检测同时将Intent对象中的URI和数据类型与过滤器中的URI和数据类型相比较。
该过程遵循以下规则：
 * 不包含URI和数据类型的Intent对象只有在过滤器也不指定任何URI及数据类型时才能通过检测。
 * 包含URI但不包含数据类型（且数据类型不能通过URI推断出来）的Intent对象只有在其URI与过滤器中的URI相匹配且过滤器同样没有指定类型时才能通过检测。这是仅仅在类似mailto:和tel:这样没有指向实际数据的URI时才会出现的情况。
 * 包含数据类型但不包含URI的Intent对象只有在过滤器列出了相同的数据类型 而没有指定URI时才能通过检测。
 * 同时包含有URI和数据类型（或URI可以推导出数据类型）的Intent对象在其数据类型与过滤器中列出的类型相匹配时通过检测的数据类型部分。当其URI与过滤器中的URI相匹配，或，其具有一个content:或file:URI并且过滤器没有指定URI时，通过测试的URI部分。换言之，如果过滤器仅列出了数据类型，一个组件将被假定支持content:和file:数据。

--------


##### 启动浏览器

示例1：(启动系统默认浏览器)


```
        Intent intent = new Intent();
        intent.setAction("android.intent.action.VIEW");
        Uri content_url = Uri.parse("http://jctech.cc");
        intent.setData(content_url);
        startActivity(intent);
```

或者：

```       
 startActivity(new Intent("android.intent.action.VIEW", Uri.parse("http://jctech.cc")));
```

在Android程序中我们可以通过发送显式Intent来启动指定的浏览器。
示例2：(启动指定浏览器)

```
         Intent intent = new Intent();        
         intent.setAction("android.intent.action.VIEW");    
         Uri content_url = Uri.parse("http://www.163.com");   
         intent.setData(content_url);       
         //启动Android原生浏览器    
         intent.setClassName("com.android.browser","com.android.browser.BrowserActivity");   
         startActivity(intent);
```

只要修改以intent.setClassName("com.android.browser","com.android.browser.BrowserActivity");
中相应的应用程序packagename 和要启动的activity即可启动其他浏览器来
uc浏览器"："com.uc.browser", "com.uc.browser.ActivityUpdate“
opera浏览器："com.opera.mini.android", "com.opera.mini.android.Browser"
qq浏览器："com.tencent.mtt", "com.tencent.mtt.MainActivity"

-----


##### 通过浏览器链接启动本地 Activity

Manifest文件中配置Activity属性：

```
<activity android:name=".LocalActivity" >
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.BROWSABLE"/>
                <category android:name="android.intent.category.DEFAULT"/>
                <data android:scheme="app"/>
            </intent-filter>
</activity>
```


在html文件中加入超链接：`<a href="app://hello">launch app</a>`


---


## Activity跳转时的数据传递
Activity之间的数据传递，常见的有4中，Intent传递简单数据，Bundle传递数据包，传递值对象，获取Activity的返回参数



#### 1. Intent传递简单数据

* Activity通过Intent启动时，可以通过Intent对象携带数据到目标Activity


```
		Intent intent = new Intent(this, SecondActivity.class);
    	intent.putExtra("maleName", maleName);
    	intent.putExtra("femaleName", femaleName);
    	startActivity(intent);
```

* 在目标Activity中取出数据


```
		Intent intent = getIntent();
		String maleName = intent.getStringExtra("maleName");
		String femaleName = intent.getStringExtra("femaleName");
```


#### 2. Bundle传递数据包
>通过使用Bundle可以传递稍微复杂的数据，进行数据交互。

* MainActivity


```
Intent intent = new Intent(MainActivity.this,OtherActivity.class);

 Bundle bundle = new Bundle();

 bundle.putString("name","MirGao");
 bundle.putString("age","24");

 intent.putExtras(bundle);
 startActivity(intent);
```

* OtherActivity


```
Intent intent = getIntent();
Bundle b = intent.getExtras();
tv.setText(b.getString("name") + "  " + b.getString("age"));
```


### 3.传递值对象 
>所谓的值对象，就是我们通常在项目中自定义的，有数据类型的。 
那我们就先自定义一个数据类型
```
public class UserBean implements Serializable{

    private String name;
    private String age;

    public UserBean(String name, String age) {
        this.name = name;
        this.age = age;
    }


    public void setName(String name) {
        this.name = name;
    }

    public void setAge(String age) {
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public String getAge() {
        return age;
    }
}

```
>在这里我们定义了两个都是String类型的参数，并且实现了Serializable接口。使我们的自定义数据类型进行数据序列化

* 在MainActivity中


```
Intent intent = new Intent(MainActivity.this,OtherActivity.class);
intent.putExtra("UserBean",new UserBean("MirGao","24"));
startActivity(intent);
```
直接进行自定义对象的传递，并赋予两个参数

* OtherActivity


```
UserBean userBean ;
userBean = (UserBean) getIntent().getSerializableExtra("UserBean");
tv.setText(userBean.getName() + "  " + userBean.getAge());
```

>使用UserBean对象获取序列化后的对象并进行强制转换，并通过获取的对象，进行操作。
使用序列化很简单，方便的可以进行复杂，大量数据的传递，但是，Serializable与Parcelable相比而言 效率比较低 ，所以Android平台又给我们提供了Parcelable,他是一个专门针对移动工具上数据序列化的接口，那么，下面我们就来进行学习。


* UserBean


```
public class UserBean implements Parcelable{

    private String name;
    private String age;

    public UserBean(String name, String age) {
        this.name = name;
        this.age = age;
    }


    protected UserBean(Parcel in) {
        name = in.readString();
        age = in.readString();
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setAge(String age) {
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public String getAge() {
        return age;
    }

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeString(getName());
        dest.writeString(getAge());
    }

    public static final Creator<UserBean> CREATOR = new Creator<UserBean>() {
        @Override
        public UserBean createFromParcel(Parcel in) {
            return new UserBean(in.readString(),in.readString());
        }

        @Override
        public UserBean[] newArray(int size) {
            return new UserBean[size];
        }
    };
}

```

>我们实现了Parcelable接口，并且实现了3个方法， 
writeToParcel 
这个方法中是需要我么去手动读取的，我们把我们要传递的变量保存，以供其他的成员变量或者组件使用


* OtherActivity


```
UserBean userBean = getIntent().getParcelableExtra("UserBean");
tv.setText(userBean.getName() + "  " + userBean.getAge());
```

>总结：Serializable和Parcelable都是序列化接口，因为Serializable简单，方便，Android系统对他有自动完成序列化的操作，所以速度是比较慢的。而Parcelable中都是手动去添加数据类型，读取数据，Android系统并没有给我们提供序列化机制，所以Parcelable的数据是相对复杂的，但是速度是比较快的。所以在使用时，注意优缺点选择。


### 4.获取Activity的返回参数


* MainActivity


```
public class MainActivity extends AppCompatActivity {

    private Button next_btn;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        next_btn = (Button) findViewById(R.id.button);

        next_btn.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View v) {
                Intent intent = new Intent(MainActivity.this,OtherActivity.class);

                intent.putExtra("UserBean",new UserBean("MirGao","24"));
                startActivityForResult(intent,1);
            }
        });
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (resultCode == 1){
            if (requestCode == 1){
               // TODO 
               //做你需要做的操作
            }
        }

    }
}

```

* OtherActivity

```
public class OtherActivity extends Activity {

    private TextView tv;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.other);

        tv = (TextView) findViewById(R.id.tv);

        UserBean userBean = getIntent().getParcelableExtra("UserBean");
        tv.setText(userBean.getName() + "  " + userBean.getAge());

        setResult(1);
    }
}

```



---

# Activity生命周期

### void onCreate()
* Activity已经被创建完毕
* 当活动第一次启动的时候，触发该方法，可以在此时完
成活动的初始化工作。onCreate 方法有一个参数，该参数可以为空（ null ），
也可以是之前调用onSaveInstanceState（）方法保存的状态信息。


### void onStart()
* 该方法的触发表示所属活动将被展现给用户。Activity已经显示在屏幕，但没有得到焦点



### void onResume()

* Activity得到焦点，可以与用户交互


### void onPause()

* Activity失去焦点，无法再与用户交互，但依然可见。
* 当一个正在前台运行的活动因为其他的活动需要前台运行
而转入后台运行的时候，触发该方法。这时候需要将活动的状态持久化，比如正
在编辑的数据库记录等。


### void onStop()
* Activity不可见，进入后台。
* 当一个活动不再需要展示给用户的时候，触发该方法。如
果内存紧张，系统会直接结束这个活动，而不会触发onStop 方法。所以保存
状态信息是应该在onPause 时做，而不是onStop 时做。活动如果没有在前台运
行，都将被停止或者Linux 管理进程为了给新的活动预留足够的存储空间而随时
结束这些活动。因此对于开发者来说，在设计应用程序的时候，必须时刻牢记这
一原则。在一些情况下，onPause 方法或许是活动触发的最后的方法，因此开发
者需要在这个时候保存需要保存的信息。


### void onDestroy()
* Activity被销毁。
* 当活动销毁的时候，触发该方法。和onStop 方法一
样，如果内存紧张，系统会直接结束这个活动而不会触发该方法。
·onSaveInstanceState ：系统调用该方法，允许活动保存之前的状态，比如说
在一串字符串中的光标所处的位置等。
通常情况下，开发者不需要重写覆盖该方法，在默认的实现中，已经提供了自动
保存活动所涉及到的用户界面组件的所有状态信息。


### void onRestart()
* 当处于停止状态的活动需要再次展现给用户的时候，触
发该方法，即从不可见变成可见时会执行此方法


##### 使用场景
* Activity创建时需要初始化资源，销毁时需要释放资源；或者播放器应用，在界面进入后台时需要自动暂停

##### 完整生命周期（entire lifetime）
onCreate-->onStart-->onResume-->onPause-->onStop-->onDestory

##### 可视生命周期（visible lifetime）
onStart-->onResume-->onPause-->onStop

##### 前台生命周期（foreground lifetime）
onResume-->onPause

#### Activity生命周期图

![img](./09451766.png)


demo：

一个Activity 的启动顺序：
onCreate()——>onStart()——>onResume()
当另一个Activity 启动时:
第一个Activity onPause()——>第二个Activity onCreate()—
—>onStart()——>onResume()
——>第一个Activity onStop()
当返回到第一个Activity 时：
第二个Activity onPause() ——> 第一个Activity onRestart()—
—>onStart()——>onResume()
——>第二个Activity onStop()——>onDestroy()

如果给第二个activity设置透明窗口主题（`android:theme="@style/Base.Theme.AppCompat.Dialog"`）
![img](./1467906201718.png)
从第一个activity跳转到第二个activity过程：
AActivity: onCreate---onStart--onResume--onPause(A依然可见但不可交互)
BActivity: onCreate--onStart--onResume（B以窗口对话框形式在AActivity上面，可见可交互）

点击空白处或者返回：
BActivity： onPause
AActivity： onResume
BActivity:    onStop--onDestory


---


### Activity的四种启动模式
>每个应用会有一个Activity任务栈，存放已启动的Activity
>
>Activity的启动模式，修改任务栈的排列情况

* standard 标准启动模式
* singleTop 单一顶部模式 
	* 如果任务栈的栈顶存在这个要开启的activity，不会重新的创建activity，而是复用已经存在的activity。保证栈顶如果存在，不会重复创建。
	* 应用场景：浏览器的书签
* singeTask 单一任务栈，在当前任务栈里面只能有一个实例存在
	* 当开启activity的时候，就去检查在任务栈里面是否有实例已经存在，如果有实例存在就复用这个已经存在的activity，并且把这个activity上面的所有的别的activity都清空，复用这个已经存在的activity。保证整个任务栈里面只有一个实例存在.
	* 应用场景：浏览器的activity
	* 如果一个activity的创建需要占用大量的系统资源（cpu，内存）一般配置这个activity为singletask的启动模式。

* singleInstance启动模式非常特殊， activity会运行在自己的任务栈里面，并且这个任务栈里面只有一个实例存在
	* 如果你要保证一个activity在整个手机操作系统里面只有一个实例存在，使用singleInstance
	* 应用场景： 电话拨打界面

---


#### 横竖屏切换
>默认情况下 ，横竖屏切换， 销毁当前的activity，重新创建一个新的activity

在一些特殊的应用程序常见下，比如游戏，不希望横竖屏切换activity被销毁重新创建，例如，activity切换时，edittext里面的文字没有了
需求：禁用掉横竖屏切换的生命周期
解决方法：
1. 横竖屏写死 ,在AndroidManifest.xml里加入声明


```
android:screenOrientation="landscape"
android:screenOrientation="portrait"
```
2. 让系统的环境 不再去敏感横竖屏的切换。


```
 android:configChanges="orientation|screenSize"
```


3. 给edittext控价加上id，系统会自动保存然后恢复，或者在onSaveInstanceState保存，在重新创建的oncreate方法中恢复

---


#### 开启activity获取返回值
##### 从A界面打开B界面， B界面关闭的时候，返回一个数据给A界面
步骤：
1. 开启activity并且获取返回值


```
//第一个参数为请求码，即调用startActivityForResult()传递过去的值
//第二个参数为结果码，可以根据业务需求自己编号，结果码用于标识返回数据来自哪个新Activity
startActivityForResult(intent, 0);
```
2. 在新开启的界面里面实现设置数据的逻辑


```
		Intent data = new Intent();
		data.putExtra("phone", phone);
		//设置一个结果数据，数据会返回给调用者
		setResult(0, data);
		finish();//关闭掉当前的activity，才会返回数据
```
3. 在开启者activity里面实现方法


```
//通过data获取返回的数据
onActivityResult(int requestCode, int resultCode, Intent data) 
```
		
4. 根据请求码和结果码确定业务逻辑


 * 请求码：用来区分数据来自于哪一个Activity
 * 结果码：用来区分，返回的数据时属于什么类型


------------


### 利用Android 提供的Parcelable 传递数据

实现Parcelable步骤
1. implements Parcelable
2. 重写writeToParcel方法，将你的对象序列化为一个Parcel对象，即：将类的数据写入外部提供的Parcel中，打包需要传递的数据到Parcel容器保存，以便从 Parcel容器获取数据
3. 重写describeContents方法，内容接口描述，默认返回0就可以
4. 实例化静态内部对象CREATOR实现接口Parcelable.Creator


>Parcelable的性能比Serializable好，在内存开销方面较小，所以在内存间数据传输时推荐使用Parcelable，如activity间传输数据。而Serializable可将数据持久化方便保存，所以在需要保存或网络传输数据时选择Serializable，因为android不同版本Parcelable可能不同，所以不推荐使用Parcelable进行数据持久化Serializable的作用是为了保存对象的属性到本地文件、数据库、网络流、rmi以方便数据传输，当然这种传输可以是程序内的也可以是两个程序间的。而Android的Parcelable的设计初衷是因为Serializable效率过慢，为了在程序内不同组件间以及不同Android程序间(AIDL)高效的传输数据而设计，这些数据仅在内存中存在，Parcelable是通过IBinder通信的消息的载体。

选择序列化方法的原则
1）在使用内存的时候，Parcelable比Serializable性能高，所以推荐使用Parcelable。
2）Serializable在序列化的时候会产生大量的临时变量，从而引起频繁的GC。
3）Parcelable不能使用在要将数据存储在磁盘上的情况，因为Parcelable不能很好的保证数据的持续性在外界有变化的情况下。尽管Serializable效率低点，但此时还是建议使用Serializable 。


--------------

## 问题记录：

#####Android Activity为什么要细化出onCreate、onStart、onResume、onPause、onStop、onDesdroy这么多方法让应用去重载？

>如下是一段典型的Activity间切换的日志，从AActivity切换到BActivity：


```
[plain] view plain copy print?
10-17 20:54:42.247: I/com.example.servicetest.AActivity(5817): onCreate() 1166919192 taskID=66
10-17 20:54:42.263: I/com.example.servicetest.AActivity(5817): onStart() 1166919192 taskID=66
10-17 20:54:42.263: I/com.example.servicetest.AActivity(5817): onResume() 1166919192 taskID=66
10-17 20:54:46.997: I/com.example.servicetest.AActivity(5817): onPause() 1166919192 taskID=66
10-17 20:54:47.021: I/com.example.servicetest.BActivity(5817): onCreate() 1166971824 taskID=66
10-17 20:54:47.028: I/com.example.servicetest.BActivity(5817): onStart() 1166971824 taskID=66
10-17 20:54:47.028: I/com.example.servicetest.BActivity(5817): onResume() 1166971824 taskID=66
10-17 20:54:47.099: I/com.example.servicetest.AActivity(5817): onStop() 1166919192 taskID=66  
```
>当触发从AActivity切换到BActivity时的日志如下：


```
10-17 20:54:46.997: I/com.example.servicetest.AActivity(5817): onPause() 1166919192 taskID=66
10-17 20:54:47.021: I/com.example.servicetest.BActivity(5817): onCreate() 1166971824 taskID=66
10-17 20:54:47.028: I/com.example.servicetest.BActivity(5817): onStart() 1166971824 taskID=66
10-17 20:54:47.028: I/com.example.servicetest.BActivity(5817): onResume() 1166971824 taskID=66
10-17 20:54:47.099: I/com.example.servicetest.AActivity(5817): onStop() 1166919192 taskID=66
```

先AActivity的onPause()被调用，然后是BActivity的初始化流程（onCreate() --> onStart() --> onResume()），再然后是AActivity的onStop()被调用。
有点意思，为什么不是先AActivity的onPause()、onStop()被调用，然后再BActivity的初始化流程（onCreate() --> onStart() --> onResume()）？
或者又为什么不是先BActivity的初始化流程（onCreate() --> onStart() --> onResume()），再AActivity的onPause()、onStop()被调用？

如下是Activity的几个关键方法的注释：
>**void android.app.Activity.onCreate(Bundle savedInstanceState)**
Called when the activity is starting. This is where most initialization should go: calling setContentView(int) to inflate the activity's UI, using findViewById to programmatically interact with widgets in the UI, calling managedQuery(android.net.Uri, String[], String, String[], String) to retrieve cursors for data being displayed, etc. 
You can call finish from within this function, in which case onDestroy() will be immediately called without any of the rest of the activity lifecycle (onStart, onResume, onPause, etc) executing. 

 
>**void android.app.Activity.onStart()**
Called after onCreate — or after onRestart when the activity had been stopped, but is now again being displayed to the user. It will be followed by onResume.
 
>**void android.app.Activity.onResume()**
Called after onRestoreInstanceState, onRestart, or onPause, for your activity to start interacting with the user. This is a good place to begin animations, open exclusive-access devices (such as the camera), etc. 
Keep in mind that onResume is not the best indicator that your activity is visible to the user; a system window such as the keyguard may be in front. Use onWindowFocusChanged to know for certain that your activity is visible to the user (for example, to resume a game). 

>**void android.app.Activity.onPause()**
Called as part of the activity lifecycle when an activity is going into the background, but has not (yet) been killed. The counterpart to onResume. 
When activity B is launched in front of activity A, this callback will be invoked on A. B will not be created until A's onPause returns, so be sure to not do anything lengthy here. 
This callback is mostly used for saving any persistent state the activity is editing, to present a "edit in place" model to the user and making sure nothing is lost if there are not enough resources to start the new activity without first killing this one. This is also a good place to do things like stop animations and other things that consume a noticeable amount of CPU in order to make the switch to the next activity as fast as possible, or to close resources that are exclusive access such as the camera. 
In situations where the system needs more memory it may kill paused processes to reclaim resources. Because of this, you should be sure that all of your state is saved by the time you return from this function. In general onSaveInstanceState is used to save per-instance state in the activity and this method is used to store global persistent data (in content providers, files, etc.) 
After receiving this call you will usually receive a following call to onStop (after the next activity has been resumed and displayed), however in some cases there will be a direct call back to onResume without going through the stopped state. 

>**void android.app.Activity.onStop()**
Called when you are no longer visible to the user. You will next receive either onRestart, onDestroy, or nothing, depending on later user activity. 
Note that this method may never be called, in low memory situations where the system does not have enough memory to keep your activity's process running after its onPause method is called. 


--------------
>**如果所有的初始化都在onCreate()中实现，会有什么问题？**
    首先，Activity的onCreate()被调用时，Activity还不可见，如果要做一些动画，既然视图还不存在，在onCreate中来启动动画，明显有问题；
    其次，AActivity 切换到 BActivity，再切换到 AActivity（我们假定是AActivity的同一个实例），由于实例已经存在，所以onCreate不会再被调用，那AActivity从后台切换至前台时，有可能需要一些初始化，那就没法再被调用到了，也有问题；

>**如果所有的初始化都在onStart()中实现，会有什么问题？**
  *   首先，onCreate()注释中，是明确建议 setContentView()、findViewById() 要在 onCreate() 中被调用，但我实测了一下，在onStart()中调用 setContentView()、findViewById() 功能也是正常的；
  *   其次，onStart() 被调用时，Activity可能是可见了，但还不是可交互的，onResume()的注释中都明确地说了这不是Activity对用户是可见的最好的指示器，onStart() 在这之前被调用，那有一些特殊的初始化相关的逻辑在这里被调用也会有问题。

>**如果把所有的去初始化都在onStop()中实现，会有什么问题？**
1.  在 onResume() 的注释中，建议是在onResume()中打开独占设备（比如相机），与onResume()对应的是onPause()，所以所有的去初始化操作放在onStop()中执行，可能会引出新的问题；
2. onStop() 的注释中明确地写了，在内存不足而导致系统无法保留此进程的情况下，onStop() 可能都不会被执行。
    我的老Android手机的相机应用如果未正常关闭，相机在不重启系统的情况下就无法再正常启动，估计就和这个机制有关；相机进程是被强制杀掉的，而导致去初始化操作未被正常执行。

 
>**Activity间跳转时，为什么是先AActivity的onPause()被调用，然后是BActivity的初始化流程（onCreate() --> onStart() --> onResume()），再然后是AActivity的onStop()被调用？**
* 在 onResume() 的注释中，建议是在onResume()中打开独占设备（比如相机），与onResume()对应的是onPause()，关闭相机的操作也应该在此方法中被调用；否则，考虑一下如下场景：
        如果AActivity打开了相机，我们点击某按钮要跳转到BActivity中，BActivity也想打开相机；假设AActivity的onPause() 在 BActivity启动后再被调用，那BActivity根本就无法再正常启动相机。
* onPause() 的注释中，也明确地说了，在这个方法中执行停止动画等比较耗CPU的操作，如果不先执行这些操作，就先启动新应用，然后再来执行此操作，确实是不合逻辑；


从AActivity切换到BActivity的日志如下：

```
10-17 20:54:46.997: I/com.example.servicetest.AActivity(5817): onPause() 1166919192 taskID=66
10-17 20:54:47.021: I/com.example.servicetest.BActivity(5817): onCreate() 1166971824 taskID=66
10-17 20:54:47.028: I/com.example.servicetest.BActivity(5817): onStart() 1166971824 taskID=66
10-17 20:54:47.028: I/com.example.servicetest.BActivity(5817): onResume() 1166971824 taskID=66
10-17 20:54:47.099: I/com.example.servicetest.AActivity(5817): onStop() 1166919192 taskID=66
```


从逻辑的完整性和用户体验的角度来分析，这样实现确实是比较合理的，当用户触发某事件切换到新的Activity，用户肯定是想尽快进入新的视图进行操作，上面已经说了，在onResume()一般会打开独占设备，开启动画等，当需要从AActivity切换到BActivity时，先执行AActivity中的与onResume()相对应的onPause()操作，比如关闭独占设备，关闭动画，或其它耗费cpu的操作；以防止BActivity也需要使用这些资源，关闭耗CPU的操作，也有利于BActivity运行的流畅。
底层执行AActivity的onPause()时，有一定的时间限制的，当ActivityManagerService通知应用进程暂停指定的Activity时，如果对应的onPause()在500ms内还没有执行完，ActivityManagerService就会强制关闭这个Activity。如下就是对应的onPause()执行超时常量定义：

```
[java] view plain copy print?
// How long we wait until giving up on the last activity to pause.  This  
// is short because it directly impacts the responsiveness of starting the  
// next activity.  
static final int PAUSE_TIMEOUT = 500;  // 定义在ActivityStack.java中  
```

AActivity中比较消耗资源的部分关闭后，再切换到BActivity中执行BActivity的初始化，显示BActivity中的View。
当BActivity已经执行显示出来了，用户可以交互，后台再去执行AActivity的onStop()操作，即使这里面有些比较耗时的操作，也没有关系，这是在后台执行所以也不影响用户的体验。