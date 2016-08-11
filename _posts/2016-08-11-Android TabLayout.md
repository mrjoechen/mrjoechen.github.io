---
layout:     post
title:      "Android TabLayout "
subtitle:   " \"Android Tab滑动布局\""
date:       2016-08-11 12:00:00
author:     "Joe"
header-img: "img/post-2016-sunsetglow.jpg"
tags:
    - Android学习笔记
    - Android TabLayout
---


## Android TabLayout


最近在项目中需要实现Tab标签切换的效果，选择使用的android中Meterial Design控件TabLayout。
在App中Tab也是很常见的，它的实现方式也有很多：TabHost，自定义控件（第三方库）ViewPager与ViewPagerIndicator，RadioGroup等等。在2015年的google大会上，google发布了基于Meterial Design的Android Support Design库，里面包含了许多新的控件，其中有一个TabLayout，它就可以完成TabPageIndicator的效果，使用起来也比较方便。


##### 先上效果图：

![img](/img/in-post/2016-08-11-Android TabLayout/2016-08-11-Android-TabLayout.gif)


* 官方文档：


>TabLayout provides a horizontal layout to display tabs.
>Population of the tabs to display is done through TabLayout.Tab instances. You create tabs via newTab(). From there you can change the tab's label or icon via setText(int) and setIcon(int) respectively. To display the tab, you need to add it to the layout via one of the addTab(Tab) methods. 
>You should set a listener via setOnTabSelectedListener(OnTabSelectedListener) to be notified when any tab's selection state has been changed.
>If you're using a ViewPager together with this layout, you can use setTabsFromPagerAdapter(PagerAdapter) which will populate the tabs using the given PagerAdapter's page titles. You should also use a TabLayout.TabLayoutOnPageChangeListener to forward the scroll and selection changes to this layout .

* TbaLayout提供了展示Tab的水平布局（`TabLayout`继承自`HorizontalScrollView`）,选项卡的显示是通过TabLayout.Tab实例来完成。通过创建newTab（）创建实例，利用setText（int）和setIcon（int）分别更改选项卡的标签或图标。要显示Tab需要通过的addTab（TAB）的方法，将其添加到布局。


* 你应该通过setOnTabSelectedListener（OnTabSelectedListener）设置一个监听器，当任何标签的选择状态更改时可以被通知。如果你在一起使用ViewPager用此布局，您可以使用setTabsFromPagerAdapter（PagerAdapter），使用给定的PagerAdapter的将页面标题填入的选项卡。你也应该使用TabLayout.TabLayoutOnPageChangeListener到滚动和选择更改转发到这个布局。

### 简单使用：

* 首先，在build.gradle中加入依赖`compile 'com.android.support:design:24.4.1'`
* 创建布局文件，添加TabLayout和Viewpager作为上下的布局


CompartmentActivity.xml


```
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:orientation="vertical"
    tools:context="com.thunder.myapplication.Fragment.CompartmentFragment">

    <android.support.design.widget.TabLayout
        android:id="@+id/tl_title"
        android:background="#1A1C28"
        android:layout_width="match_parent"
        android:layout_height="180dp"
        app:tabPaddingTop="50dp"
        app:tabSelectedTextColor="@color/colorAccent"
        app:tabTextAppearance="@style/MyTabLayoutTextAppearance"
        app:tabIndicatorColor="#1A1C28"/>

    <android.support.v4.view.ViewPager
        android:id="@+id/vp_pager"
        android:layout_width="match_parent"
        android:layout_height="0dp"
        android:layout_weight="1"/>

</LinearLayout>

```


* 创建每个pager页面布局文件，这里采用一个SwipeRefreshLayout和RecyclerView，方便RecyclerView进行刷新
BoxBaseFragment.xml

```
<?xml version="1.0" encoding="utf-8"?>
<android.support.v4.widget.SwipeRefreshLayout
        xmlns:android="http://schemas.android.com/apk/res/android"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:orientation="vertical"
        android:id="@+id/swipeLayout" >
    <android.support.v7.widget.RecyclerView
        android:id="@+id/rv_box"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:paddingLeft="10dp"
        android:paddingRight="10dp"
        android:paddingTop="30dp"
        android:paddingBottom="30dp"/>
</android.support.v4.widget.SwipeRefreshLayout>
```

* 核心代码实现(在Activity或者Fragment中)

```

private TabLayout mTabLayout;
private ViewPager mViewPager;
private FragmentPagerAdapter fAdapter;
private List<Fragment> list_fragment;
private List<String> list_title;
private List<RoomClass.DataBean.LvBean> mRoomClassList;

mTabLayout = (TabLayout) findViewById(R.id.tl_Compartment_title);
mViewPager = (ViewPager) findViewById(R.id.vp_Compartment_pager);

list_title = new ArrayList<>();
list_fragment = new ArrayList<>();

  //设置TabLayout的模式
     mTabLayout.setTabMode(TabLayout.MODE_FIXED);
     if (mRoomClassList != null) {
         for (int i = 0; i < mRoomClassList.size(); i++) {

             //加载tab名字列表
             list_title.add("Tab_name");
             //初始化各fragment,并加入列表
             BoxBaseFragment boxBaseFragment = new BoxBaseFragment();
             list_fragment.add(boxBaseFragment);
             //为TabLayout添加tab名称
             mTabLayout.addTab(mTabLayout.newTab().setText(list_title.get(0)));
         }
   }
       fAdapter = new CompartFragmentAdapter(getSupportFragmentManager(), list_fragment, list_title);
       //viewpager加载adapter
       mViewPager.setAdapter(fAdapter);
       //TabLayout加载viewpager
       mTabLayout.setupWithViewPager(mViewPager);
```

* 最后在每个Fragment实现自己所需要显示的内容，方便管理每个页面

```

public class BoxBaseFragment extends Fragment {


    public BoxBaseFragment() {

    }

    public void setBoxClass(String boxClass) {
        this.boxClass = boxClass;
    }

    public String getBoxClass() {
        return boxClass;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mActivity = getActivity();

    }


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState){
        return initView();
    }

    @Override
    public void onActivityCreated(@Nullable Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
    }

    //初始化控件
    public View initView(){
        View view = View.inflate(mActivity, R.layout.fragment_boxbase, null);
        mRecyclerView = (RecyclerView) view.findViewById(R.id.rv_box);
        mSwipeRefreshLayout = (SwipeRefreshLayout) view.findViewById(R.id.swipeLayout);
        return view;
    }

    //初始化数据
    public void initData() {
    
		}

}


```

PS：TabLayout也可以根据需要自己定制样式


1.改变选中字体的颜色

```
	app:tabSelectedTextColor="@android:color/holo_orange_light"
```
2.改变未选中字体的颜色

```
		app:tabTextColor="@color/colorPrimary"
```
3.改变指示器下标的颜色

```
		app:tabIndicatorColor="@android:color/holo_orange_light"
```
4.改变整个TabLayout的颜色

```
		app:tabBackground="color"
```
5.改变TabLayout内部字体大小

```
		app:tabTextAppearance="@android:style/TextAppearance.Holo.Large"//设置文字样式
```
6.改变指示器下标的高度

```
		app:tabIndicatorHeight="4dp"
```
7.添加图标

```
		tabLayout.addTab(tabLayout.newTab().setText("Tab 1").setIcon(R.mipmap.ic_launcher));
```
8.TabLayout的监听事件

给选中tab设置监听事件OnTabSelectedListener()：

```
tabLayout.setOnTabSelectedListener(newTabLayout.OnTabSelectedListener() {
				@Override
				public voidonTabSelected(TabLayout.Tab tab) {
				//选中了tab的逻辑
				}
				@Override
				public voidonTabUnselected(TabLayout.Tab tab) {
				//未选中tab的逻辑
				}
				@Override
				public voidonTabReselected(TabLayout.Tab tab) {
				//再次选中tab的逻辑
					}
		});
```
