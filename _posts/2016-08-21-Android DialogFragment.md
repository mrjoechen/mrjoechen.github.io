---
layout:     post
title:      "Android DialogFragment "
subtitle:   " \"Android DialogFragment简单用法\""
date:       2016-08-20 12:00:00
author:     "Joe"
header-img: "img/post-2016-sunsetglow.jpg"
tags:
    - Android学习笔记
    - Android TabLayout
---


## DialogFragment简单使用


谷歌官方推荐使用DialogFragment来管理对话框，当旋转屏幕和按下后退键时可以更好的利用其生命周期管理dialog，它和Fragment有着基本一致的声明周期。



`DialogFragment`至少需要实现`onCreateView`或者`onCreateDIalog`方法中的一个。
在`onCreateView`方法即使用定义的xml布局文件展示Dialog。`onCreateDialog`利用AlertDialog或者Dialog创建出Dialog



1. 在`onCreateView`方法即使用定义的xml布局文件展示Dialog



```
	public class MyDialogFragment extends DialogFragment  {  
	    @Override  
	    public View onCreateView(LayoutInflater inflater, ViewGroup container,  
	            Bundle savedInstanceState){  
	        //自定义布局样式
	        View view = inflater.inflate(R.layout.fragment_dialog, container);  
	        return view;  
	    }  
	} 
```


弹出对话框：


```
	MyDialogFragment mDialogFragment= new MyDialogFragment ();  
	mDialogFragment.show(getFragmentManager(), "MyDialogment");
```

2. `onCreateDialog`利用AlertDialog或者DialogBuilder创建出Dialog

```
public class MyDialogFragment extends DialogFragment  
{  
  
    @Override  
    public Dialog onCreateDialog(Bundle savedInstanceState)  
    {  
        AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());  
        // Get the layout inflater  
        LayoutInflater inflater = getActivity().getLayoutInflater();  
        View view = inflater.inflate(R.layout.fragment_dialog, null);  
        // Inflate and set the layout for the dialog  
        // Pass null as the parent view because its going in the dialog layout  
        builder.setView(view)  
                // Add action buttons  
                .setPositiveButton("Sign in",  
                        new DialogInterface.OnClickListener()  
                        {  
                            @Override  
                            public void onClick(DialogInterface dialog, int id)  
                            {  
                            }  
                        }).setNegativeButton("Cancel", null);  
        return builder.create();  
    }  
}  

```

其调用方法同上

---

关于fragment和activity之间进行通信可以使用接口回调的方式

-----------------------




#### 开发过程中遇到的问题

-------------------------------

>关于dialog样式边框问题解决方法：
DialogFragment去掉默认样式，实现窗口透明

###### 方法一

* 重写onCreateDialog方法时，设置dialog样式。


--------------

		public class MyDialogFragment extends DialogFragment {

			 @Override
			public Dialog onCreateDialog(Bundle savedInstanceState) {

			  Dialog m_dialog = new Dialog(getActivity(), R.style.Dialog_No_Border);
			  LayoutInflater m_inflater = LayoutInflater.from(CustomDialogActivity.this);
			  View v = LayoutInflater.from(mContext).inflate(R.layout.xxxx, null, false);
				//LayoutInflater inflater = getActivity().getLayoutInflater();
				// Get the layout inflater
				// view = inflater.inflate(R.layout.fragment_time_chooser, null);
				// Inflate and set the layout for the dialog
			  m_dialog.setTitle(null);
			  m_dialog.setContentView(v);
			  m_dialog.show();

			  return m_dialog;
		 	}
		}

添加Dialog_No_Border样式在你的res/value/style.xml文件中。 

		<style name="Dialog_No_Border">
		 <item name="android:windowIsFloating">true</item>
		 <item name="android:windowBackground">@color/transparent_color</item>
		</style>


------------------------

###### 方法二：

* 重写onCreateview方法时

```
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {

        final Window window = getDialog().getWindow();
        //去掉默认样式中的title
        getDialog().requestWindowFeature(Window.FEATURE_NO_TITLE);
        //设置dialog背景透明
        window.setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
        view = inflater.inflate(R.layout.fragment_dialog, null);
        // Inflate and set the layout for the dialog
        // Pass null as the parent view because its going in the dialog layout
        return view;
    }
```
	
附常用方法：

Dialog 通过, getWindow() 获取; 
DialogFragment 则是getDialog().getWindow()获取;

```
//无标题
mWindow.requestFeature(Window.FEATURE_NO_TITLE);//必须放在setContextView之前调用

rootView = (ViewGroup) inflater.inflate(R.layout.rsen_base_dialog_fragment_layout,
(ViewGroup) mWindow.findViewById(android.R.id.content));
//透明状态栏
mWindow.addFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);

//退出,进入动画
mWindow.setWindowAnimations(getAnimStyles());

//清理背景变暗 
mWindow.clearFlags(WindowManager.LayoutParams.FLAG_DIM_BEHIND);

//点击window外的区域 是否消失
getDialog().setCanceledOnTouchOutside(canCanceledOnOutside());

//是否可以取消,会影响上面那条属性
setCancelable(canCancelable());

//window外可以点击,不拦截窗口外的事件
mWindow.addFlags(WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL);

//设置背景颜色,只有设置了这个属性,宽度才能全屏MATCH_PARENT
mWindow.setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
WindowManager.LayoutParams mWindowAttributes = mWindow.getAttributes();
mWindowAttributes.width = getWindowWidth();//这个属性需要配合透明背景颜色,才会真正的 MATCH_PARENT
mWindowAttributes.height = WindowManager.LayoutParams.WRAP_CONTENT;

//gravity
mWindowAttributes.gravity = getGravity();
mWindow.setAttributes(mWindowAttributes);
```