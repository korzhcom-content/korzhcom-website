"use strict";(self.webpackChunkblog=self.webpackChunkblog||[]).push([[4555],{2517:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>s,default:()=>h,frontMatter:()=>i,metadata:()=>r,toc:()=>l});var o=t(5893),a=t(1151);const i={title:"Dependency Injection Put Simply",tags:["PROGRAMMING","DEPENDENCY-INJECTION"],slug:"dependency-injection-explanation-in-simple-words"},s="Dependency Injection Put Simply",r={permalink:"/blog/dependency-injection-explanation-in-simple-words",source:"@site/blog/2020-01-08-dependency-injection-explanation-in-simple-words/index.md",title:"Dependency Injection Put Simply",description:"The concept of Dependency Injection can look over complicated especially for beginners.",date:"2020-01-08T00:00:00.000Z",formattedDate:"January 8, 2020",tags:[{label:"PROGRAMMING",permalink:"/blog/tags/programming"},{label:"DEPENDENCY-INJECTION",permalink:"/blog/tags/dependency-injection"}],readingTime:4.435,hasTruncateMarker:!0,authors:[],frontMatter:{title:"Dependency Injection Put Simply",tags:["PROGRAMMING","DEPENDENCY-INJECTION"],slug:"dependency-injection-explanation-in-simple-words"},unlisted:!1,prevItem:{title:".NET vs. Java - Which Platform Is Better for Your Software Developer Career?",permalink:"/blog/dotnet-vs-java-what-development-platform-better"},nextItem:{title:"Add extra user claims in ASP.NET Core webapp",permalink:"/blog/add-extra-user-claims-aspnet-core-webapp"}},c={authorsImageUrls:[]},l=[{value:"Menu (interfaces)",id:"menu-interfaces",level:2},{value:"Actual snacks (implementations)",id:"actual-snacks-implementations",level:2},{value:"Delivery (injection)",id:"delivery-injection",level:2},{value:"Providers",id:"providers",level:2},{value:"Wrapping up",id:"wrapping-up",level:2},{value:"Conclusions",id:"conclusions",level:2}];function d(e){const n={br:"br",h2:"h2",img:"img",li:"li",ol:"ol",p:"p",strong:"strong",...(0,a.a)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(n.p,{children:(0,o.jsx)(n.img,{src:t(9990).Z+"",width:"1000",height:"553"})}),"\n",(0,o.jsx)(n.p,{children:"The concept of Dependency Injection can look over complicated especially for beginners.\nHere, I have tried to explain it by using a very simple example from the real world: a food delivery app on your mobile phone."}),"\n",(0,o.jsx)(n.p,{children:"So, imagine you open such an app on your smartphone. Let\u2019s see what we have here:"}),"\n",(0,o.jsx)(n.h2,{id:"menu-interfaces",children:"Menu (interfaces)"}),"\n",(0,o.jsx)(n.p,{children:(0,o.jsx)(n.img,{alt:"DI concepts: intefaces are like items in a cafe menu",src:t(9802).Z+"",width:"1200",height:"675"})}),"\n",(0,o.jsxs)(n.p,{children:["Photo by ",(0,o.jsx)("a",{href:"https://unsplash.com/@elizagalevi23?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText",children:"Levi Elizaga"})," on ",(0,o.jsx)("a",{href:"https://unsplash.com/s/photos/menu?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText",children:"Unsplash"})]}),"\n",(0,o.jsxs)(n.p,{children:["Obviously, this app has a menu with a description of each item available there. To make it more similar to the Dependency Injection (DI) container let\u2019s suppose all items on the menu are more or less generic. So, you have such options as a burger, chips, green salad, a soda drink, coffee, etc. However, you don\u2019t know what meat is used for that burger, how exactly those chips are cooked, and what is the exact soda drink you will get.\nThese menu items are your ",(0,o.jsx)(n.strong,{children:"interfaces"}),". They describe the main characteristics of each snack but don\u2019t bother you with the exact implementation."]}),"\n",(0,o.jsx)(n.h2,{id:"actual-snacks-implementations",children:"Actual snacks (implementations)"}),"\n",(0,o.jsxs)(n.p,{children:["Then, you have the actual snacks which are delivered to you when you place an order. These are the ",(0,o.jsx)(n.strong,{children:"implementations"})," of your interfaces.\nObviously, the implementations can differ depending on which particular restaurant they are delivered from."]}),"\n",(0,o.jsx)(n.h2,{id:"delivery-injection",children:"Delivery (injection)"}),"\n",(0,o.jsxs)(n.p,{children:["Now, let\u2019s suppose that your app, in some magical way, has a zero-time delivery function (OK, almost zero-time).\nSo, at whatever place you are now (whatever part of your project), you select the items you need, press the \u201cOrder\u201d button, and the chosen snacks instantly appear in your hands.\nWe can say that they are ",(0,o.jsx)(n.strong,{children:"injected"})," to the place where you are now :)\nMoreover, if a snack (like breakfast or combo-meal) depends on other snacks, those dependant snacks are created automatically and also \u201cinjected\u201d into your combo-meal.\nFor example, a Big Mac Combo Meal includes a BigMac burger, some fries, and a drink. You don\u2019t need to order them separately. They will all be created and delivered to you automatically."]}),"\n",(0,o.jsx)(n.h2,{id:"providers",children:"Providers"}),"\n",(0,o.jsx)(n.p,{children:"Now let\u2019s suppose you can choose which restaurant will deliver your snacks.\nYou can choose either it will be a McDonald\u2019s or Burger King or your favorite cafe nearby."}),"\n",(0,o.jsx)(n.p,{children:"Moreover, you can also choose the type of food (with meat, fish only, vegetarian, kosher, etc).\nSo, now you can still order a burger but if you selected \u201cvegetarian\u201d,\nour magical app will deliver to you a burger with soy meat or a burger made from that cultured meat popular nowadays."}),"\n",(0,o.jsx)(n.p,{children:"The main point here is this: with this app, you can easily change the actual provider (so, the implementation)\nof your snacks without changing the simplicity and convenience of the whole process."}),"\n",(0,o.jsx)(n.h2,{id:"wrapping-up",children:"Wrapping up"}),"\n",(0,o.jsx)(n.p,{children:(0,o.jsx)(n.img,{alt:"Dependency Injection Schema",src:t(9833).Z+"",width:"821",height:"391"})}),"\n",(0,o.jsxs)(n.p,{children:["Your food delivery app here is a ",(0,o.jsx)(n.strong,{children:"Dependency Injection (DI) Container"}),". The menu items are ",(0,o.jsx)(n.strong,{children:"interfaces"})," of the services you might need somewhere in your project.\nThe actual snacks are the ",(0,o.jsx)(n.strong,{children:"implementations"})," (actual classes that implement those services).\nWhen you need your some snacks (",(0,o.jsx)(n.strong,{children:"services"}),") you tell your app (",(0,o.jsx)(n.strong,{children:"DI container"}),") what you need and they are delivered (",(0,o.jsx)(n.strong,{children:"injected"})," in the place you are now) to you immediately."]}),"\n",(0,o.jsx)(n.p,{children:"You may ask, why DI does matter? What is so special about this concept that has made it so popular?"}),"\n",(0,o.jsx)(n.p,{children:"As you can see from this real-word example, dependency injection has a lot of benefits.\nLet\u2019s list the most important ones (again, with a real-world example for each of them):"}),"\n",(0,o.jsxs)(n.ol,{children:["\n",(0,o.jsxs)(n.li,{children:["\n",(0,o.jsxs)(n.p,{children:[(0,o.jsx)(n.strong,{children:"Simplicity"}),(0,o.jsx)(n.br,{}),"\n","With DI, you don\u2019t need to write a lot of code just to create an object of a particular class.\nEspecially when this object requires several other objects for its work (like a combo-meal in our example).\nYou just \u201ctell\u201d your DI container (your food delivery app) what you need and it\u2019s delivered to you right away."]}),"\n"]}),"\n",(0,o.jsxs)(n.li,{children:["\n",(0,o.jsxs)(n.p,{children:[(0,o.jsx)(n.strong,{children:"Maintainability"}),(0,o.jsx)(n.br,{}),"\n","n terms of code, your classes become loosely coupled (each of the classes is less dependent on the concrete implementations of other classes),\nso your code will be easier to maintain.\nIn terms of our food delivery app, it\u2019s easier to maintain one app and order (inject) necessary snacks,\ninstead of thinking where to buy all the ingredients for each of them and then cook everything yourself."]}),"\n"]}),"\n",(0,o.jsxs)(n.li,{children:["\n",(0,o.jsxs)(n.p,{children:[(0,o.jsx)(n.strong,{children:"Flexibility"}),(0,o.jsx)(n.br,{}),"\n","With DI, your code becomes loosely coupled and so, more flexible, since you depend on interfaces and it\u2019s very easy to replace the implementation.\nFor example, you have a repository interface for storing data about users.\nThe initial implementation of this repository will save the data to files. After that, you can decide to use the database.\nThe implementation of the repository is changed but all the code that uses it remains the same.",(0,o.jsx)(n.br,{}),"\n","It\u2019s similar to how you switch the provider of the snacks (or the preferred type of food) in your app. The process of order and delivery remains the same, you just start getting other snacks."]}),"\n"]}),"\n"]}),"\n",(0,o.jsx)(n.h2,{id:"conclusions",children:"Conclusions"}),"\n",(0,o.jsx)(n.p,{children:"As you can see, Dependency Injection is a very useful and convenient technique,\nthe main principles of which can be applied not only in coding but in some real-world situations.\nIn terms of programming, you get more maintainable, more readable, more flexible, and more extensible code.\nThese are good enough reasons to get better acquainted with this technology and start using it in your projects."})]})}function h(e={}){const{wrapper:n}={...(0,a.a)(),...e.components};return n?(0,o.jsx)(n,{...e,children:(0,o.jsx)(d,{...e})}):d(e)}},9990:(e,n,t)=>{t.d(n,{Z:()=>o});const o=t.p+"assets/images/dependency-injection-food-app-d23496c67203b37028801d53bc2ab88b.png"},9833:(e,n,t)=>{t.d(n,{Z:()=>o});const o=t.p+"assets/images/dependency-injection-schema-401653f67386295e83a91127391480fa.png"},9802:(e,n,t)=>{t.d(n,{Z:()=>o});const o=t.p+"assets/images/di-interfaces-as-menu-50acc859ddc628cbf48a572460110880.png"},1151:(e,n,t)=>{t.d(n,{Z:()=>r,a:()=>s});var o=t(7294);const a={},i=o.createContext(a);function s(e){const n=o.useContext(i);return o.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function r(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:s(e.components),o.createElement(i.Provider,{value:n},e.children)}}}]);