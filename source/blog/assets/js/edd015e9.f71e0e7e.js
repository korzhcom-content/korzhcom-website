"use strict";(self.webpackChunkblog=self.webpackChunkblog||[]).push([[3865],{4137:(e,t,a)=>{a.d(t,{Zo:()=>d,kt:()=>m});var n=a(7294);function o(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function i(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function r(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?i(Object(a),!0).forEach((function(t){o(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):i(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function l(e,t){if(null==e)return{};var a,n,o=function(e,t){if(null==e)return{};var a,n,o={},i=Object.keys(e);for(n=0;n<i.length;n++)a=i[n],t.indexOf(a)>=0||(o[a]=e[a]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)a=i[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(o[a]=e[a])}return o}var s=n.createContext({}),p=function(e){var t=n.useContext(s),a=t;return e&&(a="function"==typeof e?e(t):r(r({},t),e)),a},d=function(e){var t=p(e.components);return n.createElement(s.Provider,{value:t},e.children)},c="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},h=n.forwardRef((function(e,t){var a=e.components,o=e.mdxType,i=e.originalType,s=e.parentName,d=l(e,["components","mdxType","originalType","parentName"]),c=p(a),h=o,m=c["".concat(s,".").concat(h)]||c[h]||u[h]||i;return a?n.createElement(m,r(r({ref:t},d),{},{components:a})):n.createElement(m,r({ref:t},d))}));function m(e,t){var a=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=a.length,r=new Array(i);r[0]=h;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l[c]="string"==typeof e?e:o,r[1]=l;for(var p=2;p<i;p++)r[p]=a[p];return n.createElement.apply(null,r)}return n.createElement.apply(null,a)}h.displayName="MDXCreateElement"},3313:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>s,contentTitle:()=>r,default:()=>u,frontMatter:()=>i,metadata:()=>l,toc:()=>p});var n=a(7462),o=(a(7294),a(4137));const i={title:"CRUD operations in ASP.NET Core with EasyData library",tags:["ASP-NET-CORE","ENTITY-FRAMEWORK","JAVASCRIPT","CRUD","PAGING","DATA-FILTERING"],slug:"crud-asp-net-core-with-easydata"},r="CRUD operations in ASP.NET Core with EasyData library",l={permalink:"/blog/crud-asp-net-core-with-easydata",source:"@site/blog/2021-03-31-crud-asp-net-core-with-easydata/index.md",title:"CRUD operations in ASP.NET Core with EasyData library",description:"Implementing CRUD operations in your ASP.NET Core application can be a very tedious and time-consuming task.",date:"2021-03-31T00:00:00.000Z",formattedDate:"March 31, 2021",tags:[{label:"ASP-NET-CORE",permalink:"/blog/tags/asp-net-core"},{label:"ENTITY-FRAMEWORK",permalink:"/blog/tags/entity-framework"},{label:"JAVASCRIPT",permalink:"/blog/tags/javascript"},{label:"CRUD",permalink:"/blog/tags/crud"},{label:"PAGING",permalink:"/blog/tags/paging"},{label:"DATA-FILTERING",permalink:"/blog/tags/data-filtering"}],readingTime:7.13,hasTruncateMarker:!0,authors:[],frontMatter:{title:"CRUD operations in ASP.NET Core with EasyData library",tags:["ASP-NET-CORE","ENTITY-FRAMEWORK","JAVASCRIPT","CRUD","PAGING","DATA-FILTERING"],slug:"crud-asp-net-core-with-easydata"},prevItem:{title:"Single-file web API services with .NET 5 and ASP.NET Core",permalink:"/blog/single-file-web-service-aspnetcore"},nextItem:{title:"ASP.NET Core default project structure explained (part 2)",permalink:"/blog/asp-net-core-project-structure-explained-part2"}},s={authorsImageUrls:[]},p=[{value:"Problem",id:"problem",level:2},{value:"Solution: EasyData library",id:"solution-easydata-library",level:2},{value:"Quick demo",id:"quick-demo",level:2},{value:"Getting Started",id:"getting-started",level:2},{value:"1. Install EasyData NuGet packages",id:"1-install-easydata-nuget-packages",level:3},{value:"2. Add EasyData middleware in <code>Startup.Configure</code>",id:"2-add-easydata-middleware-in-startupconfigure",level:3},{value:"3. Set up a catch-all page for all CRUD operations",id:"3-set-up-a-catch-all-page-for-all-crud-operations",level:3},{value:"List view screen for one entity:",id:"list-view-screen-for-one-entity",level:4},{value:"&quot;Edit Record&quot; dialog:",id:"edit-record-dialog",level:4},{value:"&quot;Lookup&quot; dialog (was opened from &quot;Edit Record&quot;):",id:"lookup-dialog-was-opened-from-edit-record",level:4},{value:"How it works",id:"how-it-works",level:2},{value:"Metadata",id:"metadata",level:3},{value:"EasyData middleware",id:"easydata-middleware",level:3},{value:"EasyData UI root page",id:"easydata-ui-root-page",level:3},{value:"Wrapping up",id:"wrapping-up",level:2}],d={toc:p},c="wrapper";function u(e){let{components:t,...i}=e;return(0,o.kt)(c,(0,n.Z)({},d,i,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,(0,o.kt)("img",{src:a(4735).Z,width:"1980",height:"963"})),(0,o.kt)("blockquote",null,(0,o.kt)("p",{parentName:"blockquote"},"Implementing CRUD operations in your ASP.NET Core application can be a very tedious and time-consuming task.\nEasyData helps to add all necessary functionality (and even more) in a matter of minutes.")),(0,o.kt)("h2",{id:"problem"},"Problem"),(0,o.kt)("p",null,"One of the first tasks for most business applications is to implement CRUD (Create, Read, Update, Delete) operations for the main entities the app works with."),(0,o.kt)("p",null,"Every developer faces the following problems as part of solving the task:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},"The creation of CRUD pages and forms is very boring and time-consuming. Believe me, I\u2019ve been there a lot of times.")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},"If you do it manually, it can be very slow and error-prone (missed fields, forgotten validators, etc).")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},"Of course, you can use the scaffolding tool provided by Visual Studio.\nHowever, it\u2019s also not a quick process either, because you need to run that tool for each model class.\nAs a result, you get many .cs and .cshtml files, which you'll have to edit manually if something in the default behavior or appearance doesn't suit your needs.\nIn the event of changes in the model classes, you'll need to update those generated controllers and pages manually\nor regenerate the code and forms from scratch for each affected model class.")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},"Moreover, even the built-in scaffolding doesn't provide some important, often essential functions such as paging or search."))),(0,o.kt)("h2",{id:"solution-easydata-library"},"Solution: EasyData library"),(0,o.kt)("p",null,"To solve most (if not all) of those problems we created the ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/KorzhCom/EasyData"},"EasyData library"),".\nThe main advantage of EasyData is that it employs a declarative approach."),(0,o.kt)("p",null,"The whole process can be split into two main steps:"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("p",{parentName:"li"},"You \u201cdescribe\u201d what data (entities and attributes) you want to work with and\nhow your application should work with that data (types, constraints, relations between entities, etc).")),(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("p",{parentName:"li"},"Based on this information, the EasyData library establishes an API endpoint for CRUD operations and a vanilla JavaScript-based UI\nthat lets your users perform those operations via the API."))),(0,o.kt)("p",null,"The most wonderful thing here is that when using Entity Framework Core,\nall you need for the first step (\u201cdescribing\u201d the data) is your DbContext.\nSimply \u201cfeed\u201d it to the library, and EasyData automatically extracts all the information needed to create the API endpoints and CRUD UI."),(0,o.kt)("h2",{id:"quick-demo"},"Quick demo"),(0,o.kt)("p",null,"Here's a small introduction video that shows how EasyData works:"),(0,o.kt)("p",null,(0,o.kt)("img",{alt:"EasyData quick demo",src:a(1305).Z,title:"EasyData quick demo",width:"800",height:"445"})),(0,o.kt)("h2",{id:"getting-started"},"Getting Started"),(0,o.kt)("p",null,"First of all, to test EasyData you can open and run one of the ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/korzh/EasyData/tree/master/samples"},"sample projects")," available in this repository."),(0,o.kt)("p",null,"Installing EasyData to your project takes the following three simple steps:"),(0,o.kt)("h3",{id:"1-install-easydata-nuget-packages"},"1. Install EasyData NuGet packages"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"EasyData.AspNetCore"),(0,o.kt)("li",{parentName:"ul"},"EasyData.EntityFrameworkCore.Relational")),(0,o.kt)("h3",{id:"2-add-easydata-middleware-in-startupconfigure"},"2. Add EasyData middleware in ",(0,o.kt)("inlineCode",{parentName:"h3"},"Startup.Configure")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-c#"},"using EasyData.Services;\n.    .    .    .    .\n\n    app.UseEndpoints(endpoints =>\n    {\n        endpoints.MapEasyData(options => {\n            options.UseDbContext<AppDbContext>();\n        });\n\n        endpoints.MapRazorPages();\n    });\n\n")),(0,o.kt)("p",null,"In the middleware options, we also specify the type of DbContext object that will be used as the source of the metadata."),(0,o.kt)("h3",{id:"3-set-up-a-catch-all-page-for-all-crud-operations"},"3. Set up a catch-all page for all CRUD operations"),(0,o.kt)("p",null,"If you're using Razor Pages, add a new page (for example ",(0,o.kt)("inlineCode",{parentName:"p"},"EasyData.chstml"),'). If it\u2019s MVC, you\'ll need a controller and a view.\nThis page will "catch" all URLs that begin with a certain prefix (',(0,o.kt)("inlineCode",{parentName:"p"},"/easydata")," by default but it's configurable). So, we use a special catch-all parameter in the route definition (",(0,o.kt)("inlineCode",{parentName:"p"},'"/easydata/{**entity}"'),")."),(0,o.kt)("p",null,"We also add EasyData styles and the script file (",(0,o.kt)("inlineCode",{parentName:"p"},"easydata.min.js"),"), which renders the data-management UI and handles all CRUD operations on the client-side."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},'@page "/easydata/{**entity}"\n@{\n    ViewData["Title"] = "EasyData";\n}\n<link rel="stylesheet" href="https://cdn.korzh.com/ed/1.2.2/easydata.min.css" />\n\n<div id="EasyDataContainer"></div>\n\n@section Scripts {\n    <script src="https://cdn.korzh.com/ed/1.2.2/easydata.min.js" type="text/javascript"><\/script>\n    <script>\n        window.addEventListener(\'load\', function () {\n            new easydata.crud.EasyDataViewDispatcher().run()\n        });\n    <\/script>\n}\n')),(0,o.kt)("p",null,"That\u2019s it. Now you can run your web app, open the ",(0,o.kt)("inlineCode",{parentName:"p"},"/easydata")," URL and enjoy CRUD functionality."),(0,o.kt)("p",null,"The result will be something like this:"),(0,o.kt)("h4",{id:"list-view-screen-for-one-entity"},"List view screen for one entity:"),(0,o.kt)("p",null,(0,o.kt)("img",{alt:"List view screen for Orders entity",src:a(1070).Z,width:"1141",height:"641"})),(0,o.kt)("h4",{id:"edit-record-dialog"},'"Edit Record" dialog:'),(0,o.kt)("p",null,(0,o.kt)("img",{alt:"Edit Record dialog",src:a(6925).Z,width:"1071",height:"907"})),(0,o.kt)("h4",{id:"lookup-dialog-was-opened-from-edit-record"},'"Lookup" dialog (was opened from "Edit Record"):'),(0,o.kt)("p",null,(0,o.kt)("img",{alt:"Lookup dialog",src:a(4205).Z,width:"1244",height:"911"})),(0,o.kt)("h2",{id:"how-it-works"},"How it works"),(0,o.kt)("p",null,"Let's briefly go over how all this magic works.\nAs we mentioned before EasyData takes care of three main things:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},"It collects database metadata.")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},"It establishes an API for the main CRUD operations.")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},"It renders UI (again, based on the metadata) and processes all user interactions in that UI."))),(0,o.kt)("p",null,"Let\u2019s explore all these parts in detail."),(0,o.kt)("h3",{id:"metadata"},"Metadata"),(0,o.kt)("p",null,"Metadata is the data about your data: what entities (tables) are stored in your database,\nhow they're connected, what attributes (fields) they have, what  the types of attributes are\nand what the constraints are with respect to the values we can store in those attributes."),(0,o.kt)("p",null,"EasyData collects metadata (in one way or another) and stores it in the instance of ",(0,o.kt)("inlineCode",{parentName:"p"},"MetaData")," class.\nThis object contains the list of entities (tables), the attributes (fields) for each entity, the connections between entities,\nand some additional information used in API and during UI rendering and processing."),(0,o.kt)("p",null,"To fill the MetaData object, we specify a metadata loader. In the example above, we did it with the UseDbContext call.\nSo, the metadata is loaded from a DbConext object. Currently (in version 1.2) this is the only metadata loader available.\nIn future versions, it will be possible to load metadata directly from a DbConnection object or perhaps with some other method."),(0,o.kt)("h3",{id:"easydata-middleware"},"EasyData middleware"),(0,o.kt)("p",null,"EasyData middleware is responsible for establishing a REST API for all CRUD (and not only) operations initiated by the client side."),(0,o.kt)("p",null,"To add the middleware to your pipeline use ",(0,o.kt)("inlineCode",{parentName:"p"},"MapEasyData")," extension function inside ",(0,o.kt)("inlineCode",{parentName:"p"},"UseEndpoints")," configuration delegate:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"   app.UseEndpoints(endpoints =>\n    {\n       endpoints.MapEasyData(options => {\n            options.UseDbContext<AppDbContext>();\n        });\n    }\n")),(0,o.kt)("p",null,"This call should be made before ",(0,o.kt)("inlineCode",{parentName:"p"},"MapMvc")," or ",(0,o.kt)("inlineCode",{parentName:"p"},"MapRazorPages"),".\nBy default, EasyData middleware is assigned to ",(0,o.kt)("inlineCode",{parentName:"p"},"/api/easydata endpoint"),", but you can change it via the configuration function (action) passed in the parameter."),(0,o.kt)("p",null,"The only thing that's required in order to configure for ",(0,o.kt)("inlineCode",{parentName:"p"},"MapEasyData")," is to tell it where to take the metadata.\nCurrently, there's just one option available: getting metadata from a DbContext.\nSo, that\u2019s why we add ",(0,o.kt)("inlineCode",{parentName:"p"},"UseDbContext<AppDbContext>()")," call in the example above.\nBesides getting metadata, ",(0,o.kt)("inlineCode",{parentName:"p"},"UseDbContext")," also provides our middleware with all the means for performing CRUD operations (via the DbContext object)."),(0,o.kt)("h3",{id:"easydata-ui-root-page"},"EasyData UI root page"),(0,o.kt)("p",null,'The third part of the EasyData setup process is the page where the CRUD user interface is rendered.\nIt must be a so-called "catch-all" Razor page or MVC view.\nBy default, this page must be opened for any path that starts with the ',(0,o.kt)("inlineCode",{parentName:"p"},"/easydata/")," prefix.\n(So, all paths like ",(0,o.kt)("inlineCode",{parentName:"p"},"/easydata/student")," or ",(0,o.kt)("inlineCode",{parentName:"p"},"/easydata/invoice")," must be processed by this page.)"),(0,o.kt)("p",null,"NB: ",(0,o.kt)("inlineCode",{parentName:"p"},"/easydata")," is the default prefix.\nYou can use another name, but in this case, it will be necessary to specify it in the options of our ",(0,o.kt)("inlineCode",{parentName:"p"},"RootDispatcherView")," object."),(0,o.kt)("p",null,"Our catch-all page can contain any HTML element of your choice.\nHowever, to ensure the visualization and normal operation of the CRUD UI, it must include the following 4 elements:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("inlineCode",{parentName:"p"},"<link>")," element with a reference to EasyData CSS file (",(0,o.kt)("inlineCode",{parentName:"p"},"easydata.min.cs"),")")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},"Container (empty ",(0,o.kt)("inlineCode",{parentName:"p"},"div")," element), in which our interface will be displayed.\nBy default, it must have the ID ",(0,o.kt)("inlineCode",{parentName:"p"},"EasyDataContainer"),", but this can also be configured with options.")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("inlineCode",{parentName:"p"},"<script>")," element with a reference to ",(0,o.kt)("inlineCode",{parentName:"p"},"easydata.min.js"),".")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},"And a small script that creates and launches the ",(0,o.kt)("inlineCode",{parentName:"p"},"EasyDataViewDispatcher")," object on page load."))),(0,o.kt)("p",null,"An example of the simplest \u201ccatch-all\u201d page you can see in the Getting Started section above."),(0,o.kt)("h2",{id:"wrapping-up"},"Wrapping up"),(0,o.kt)("p",null,"Currently, EasyData can work with .NET Core 3.1 and .NET 5.\nObviously, all ASP.NET Core and Entity Framework Core versions that can work with the specified releases of .NET (Core) are supported.\nHowever, it won't be a problem to add support for previous versions of .NET Core or even .NET Framework 4.x.\nIf anyone needs it, please ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/KorzhCom/EasyData/issues"},"submit an issue")," in EasyData's GitHub repository."),(0,o.kt)("p",null,"EasyData can be a good tool with which to quickly prototype a new project or create a POC (proof of concept)\nwhen we already understand what data we'll need but don't want to spend a lot of time on the simplest operations with that data.\nHowever, we hope that in time it will be possible to fully use this solution in the production environment."),(0,o.kt)("p",null,"So, we look forward to hearing from you with any comments or advice you may have. Of course, don't forget to ad a start for the EasyData repository on GitHub, especially if this library helped you and saved some time."),(0,o.kt)("p",null,"So, we look forward to hearing from you with any comments or advice you may have.\nOf course, don't forget to add a star for the ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/KorzhCom/EasyData"},"EasyData repository on GitHub"),",\nespecially if this library helped you and saved some time."))}u.isMDXComponent=!0},4735:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/db-objects-01-f87ae84c4f7fea1001ca1eb9d8f76b85.jpg"},1305:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/easydata-demo01-53f7ea9e49f80b56662188bca57e8664.gif"},1070:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/easydata-sshot01-4f12a74826605c5ba90a3542f6e84b52.jpg"},6925:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/easydata-sshot02-0634ad08d4b7cc8d93adabc43380007f.jpg"},4205:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/easydata-sshot03-c5f6f81aef755d682db8d1f70d5cf8e7.jpg"}}]);