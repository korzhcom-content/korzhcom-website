"use strict";(self.webpackChunkblog=self.webpackChunkblog||[]).push([[3865],{4390:(e,a,t)=>{t.r(a),t.d(a,{assets:()=>l,contentTitle:()=>o,default:()=>h,frontMatter:()=>i,metadata:()=>r,toc:()=>d});var n=t(5893),s=t(1151);const i={title:"CRUD operations in ASP.NET Core with EasyData library",tags:["ASP-NET-CORE","ENTITY-FRAMEWORK","JAVASCRIPT","CRUD","PAGING","DATA-FILTERING"],slug:"crud-asp-net-core-with-easydata"},o="CRUD operations in ASP.NET Core with EasyData library",r={permalink:"/blog/crud-asp-net-core-with-easydata",source:"@site/blog/2021-03-31-crud-asp-net-core-with-easydata/index.md",title:"CRUD operations in ASP.NET Core with EasyData library",description:"Implementing CRUD operations in your ASP.NET Core application can be a very tedious and time-consuming task.",date:"2021-03-31T00:00:00.000Z",formattedDate:"March 31, 2021",tags:[{label:"ASP-NET-CORE",permalink:"/blog/tags/asp-net-core"},{label:"ENTITY-FRAMEWORK",permalink:"/blog/tags/entity-framework"},{label:"JAVASCRIPT",permalink:"/blog/tags/javascript"},{label:"CRUD",permalink:"/blog/tags/crud"},{label:"PAGING",permalink:"/blog/tags/paging"},{label:"DATA-FILTERING",permalink:"/blog/tags/data-filtering"}],readingTime:7.13,hasTruncateMarker:!0,authors:[],frontMatter:{title:"CRUD operations in ASP.NET Core with EasyData library",tags:["ASP-NET-CORE","ENTITY-FRAMEWORK","JAVASCRIPT","CRUD","PAGING","DATA-FILTERING"],slug:"crud-asp-net-core-with-easydata"},unlisted:!1,prevItem:{title:"Single-file web API services with .NET 5 and ASP.NET Core",permalink:"/blog/single-file-web-service-aspnetcore"},nextItem:{title:"ASP.NET Core default project structure explained (part 2)",permalink:"/blog/asp-net-core-project-structure-explained-part2"}},l={authorsImageUrls:[]},d=[{value:"Problem",id:"problem",level:2},{value:"Solution: EasyData library",id:"solution-easydata-library",level:2},{value:"Quick demo",id:"quick-demo",level:2},{value:"Getting Started",id:"getting-started",level:2},{value:"1. Install EasyData NuGet packages",id:"1-install-easydata-nuget-packages",level:3},{value:"2. Add EasyData middleware in <code>Startup.Configure</code>",id:"2-add-easydata-middleware-in-startupconfigure",level:3},{value:"3. Set up a catch-all page for all CRUD operations",id:"3-set-up-a-catch-all-page-for-all-crud-operations",level:3},{value:"List view screen for one entity:",id:"list-view-screen-for-one-entity",level:4},{value:"&quot;Edit Record&quot; dialog:",id:"edit-record-dialog",level:4},{value:"&quot;Lookup&quot; dialog (was opened from &quot;Edit Record&quot;):",id:"lookup-dialog-was-opened-from-edit-record",level:4},{value:"How it works",id:"how-it-works",level:2},{value:"Metadata",id:"metadata",level:3},{value:"EasyData middleware",id:"easydata-middleware",level:3},{value:"EasyData UI root page",id:"easydata-ui-root-page",level:3},{value:"Wrapping up",id:"wrapping-up",level:2}];function c(e){const a={a:"a",blockquote:"blockquote",code:"code",h2:"h2",h3:"h3",h4:"h4",img:"img",li:"li",ol:"ol",p:"p",pre:"pre",ul:"ul",...(0,s.a)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(a.p,{children:(0,n.jsx)(a.img,{src:t(4735).Z+"",width:"1980",height:"963"})}),"\n",(0,n.jsxs)(a.blockquote,{children:["\n",(0,n.jsx)(a.p,{children:"Implementing CRUD operations in your ASP.NET Core application can be a very tedious and time-consuming task.\nEasyData helps to add all necessary functionality (and even more) in a matter of minutes."}),"\n"]}),"\n",(0,n.jsx)(a.h2,{id:"problem",children:"Problem"}),"\n",(0,n.jsx)(a.p,{children:"One of the first tasks for most business applications is to implement CRUD (Create, Read, Update, Delete) operations for the main entities the app works with."}),"\n",(0,n.jsx)(a.p,{children:"Every developer faces the following problems as part of solving the task:"}),"\n",(0,n.jsxs)(a.ul,{children:["\n",(0,n.jsxs)(a.li,{children:["\n",(0,n.jsx)(a.p,{children:"The creation of CRUD pages and forms is very boring and time-consuming. Believe me, I\u2019ve been there a lot of times."}),"\n"]}),"\n",(0,n.jsxs)(a.li,{children:["\n",(0,n.jsx)(a.p,{children:"If you do it manually, it can be very slow and error-prone (missed fields, forgotten validators, etc)."}),"\n"]}),"\n",(0,n.jsxs)(a.li,{children:["\n",(0,n.jsx)(a.p,{children:"Of course, you can use the scaffolding tool provided by Visual Studio.\nHowever, it\u2019s also not a quick process either, because you need to run that tool for each model class.\nAs a result, you get many .cs and .cshtml files, which you'll have to edit manually if something in the default behavior or appearance doesn't suit your needs.\nIn the event of changes in the model classes, you'll need to update those generated controllers and pages manually\nor regenerate the code and forms from scratch for each affected model class."}),"\n"]}),"\n",(0,n.jsxs)(a.li,{children:["\n",(0,n.jsx)(a.p,{children:"Moreover, even the built-in scaffolding doesn't provide some important, often essential functions such as paging or search."}),"\n"]}),"\n"]}),"\n",(0,n.jsx)(a.h2,{id:"solution-easydata-library",children:"Solution: EasyData library"}),"\n",(0,n.jsxs)(a.p,{children:["To solve most (if not all) of those problems we created the ",(0,n.jsx)(a.a,{href:"https://github.com/KorzhCom/EasyData",children:"EasyData library"}),".\nThe main advantage of EasyData is that it employs a declarative approach."]}),"\n",(0,n.jsx)(a.p,{children:"The whole process can be split into two main steps:"}),"\n",(0,n.jsxs)(a.ol,{children:["\n",(0,n.jsxs)(a.li,{children:["\n",(0,n.jsx)(a.p,{children:"You \u201cdescribe\u201d what data (entities and attributes) you want to work with and\nhow your application should work with that data (types, constraints, relations between entities, etc)."}),"\n"]}),"\n",(0,n.jsxs)(a.li,{children:["\n",(0,n.jsx)(a.p,{children:"Based on this information, the EasyData library establishes an API endpoint for CRUD operations and a vanilla JavaScript-based UI\nthat lets your users perform those operations via the API."}),"\n"]}),"\n"]}),"\n",(0,n.jsx)(a.p,{children:"The most wonderful thing here is that when using Entity Framework Core,\nall you need for the first step (\u201cdescribing\u201d the data) is your DbContext.\nSimply \u201cfeed\u201d it to the library, and EasyData automatically extracts all the information needed to create the API endpoints and CRUD UI."}),"\n",(0,n.jsx)(a.h2,{id:"quick-demo",children:"Quick demo"}),"\n",(0,n.jsx)(a.p,{children:"Here's a small introduction video that shows how EasyData works:"}),"\n",(0,n.jsx)(a.p,{children:(0,n.jsx)(a.img,{alt:"EasyData quick demo",src:t(1305).Z+"",title:"EasyData quick demo",width:"800",height:"445"})}),"\n",(0,n.jsx)(a.h2,{id:"getting-started",children:"Getting Started"}),"\n",(0,n.jsxs)(a.p,{children:["First of all, to test EasyData you can open and run one of the ",(0,n.jsx)(a.a,{href:"https://github.com/korzh/EasyData/tree/master/samples",children:"sample projects"})," available in this repository."]}),"\n",(0,n.jsx)(a.p,{children:"Installing EasyData to your project takes the following three simple steps:"}),"\n",(0,n.jsx)(a.h3,{id:"1-install-easydata-nuget-packages",children:"1. Install EasyData NuGet packages"}),"\n",(0,n.jsxs)(a.ul,{children:["\n",(0,n.jsx)(a.li,{children:"EasyData.AspNetCore"}),"\n",(0,n.jsx)(a.li,{children:"EasyData.EntityFrameworkCore.Relational"}),"\n"]}),"\n",(0,n.jsxs)(a.h3,{id:"2-add-easydata-middleware-in-startupconfigure",children:["2. Add EasyData middleware in ",(0,n.jsx)(a.code,{children:"Startup.Configure"})]}),"\n",(0,n.jsx)(a.pre,{children:(0,n.jsx)(a.code,{className:"language-c#",children:"using EasyData.Services;\n.    .    .    .    .\n\n    app.UseEndpoints(endpoints =>\n    {\n        endpoints.MapEasyData(options => {\n            options.UseDbContext<AppDbContext>();\n        });\n\n        endpoints.MapRazorPages();\n    });\n\n"})}),"\n",(0,n.jsx)(a.p,{children:"In the middleware options, we also specify the type of DbContext object that will be used as the source of the metadata."}),"\n",(0,n.jsx)(a.h3,{id:"3-set-up-a-catch-all-page-for-all-crud-operations",children:"3. Set up a catch-all page for all CRUD operations"}),"\n",(0,n.jsxs)(a.p,{children:["If you're using Razor Pages, add a new page (for example ",(0,n.jsx)(a.code,{children:"EasyData.chstml"}),'). If it\u2019s MVC, you\'ll need a controller and a view.\nThis page will "catch" all URLs that begin with a certain prefix (',(0,n.jsx)(a.code,{children:"/easydata"})," by default but it's configurable). So, we use a special catch-all parameter in the route definition (",(0,n.jsx)(a.code,{children:'"/easydata/{**entity}"'}),")."]}),"\n",(0,n.jsxs)(a.p,{children:["We also add EasyData styles and the script file (",(0,n.jsx)(a.code,{children:"easydata.min.js"}),"), which renders the data-management UI and handles all CRUD operations on the client-side."]}),"\n",(0,n.jsx)(a.pre,{children:(0,n.jsx)(a.code,{children:'@page "/easydata/{**entity}"\n@{\n    ViewData["Title"] = "EasyData";\n}\n<link rel="stylesheet" href="https://cdn.korzh.com/ed/1.2.2/easydata.min.css" />\n\n<div id="EasyDataContainer"></div>\n\n@section Scripts {\n    <script src="https://cdn.korzh.com/ed/1.2.2/easydata.min.js" type="text/javascript"><\/script>\n    <script>\n        window.addEventListener(\'load\', function () {\n            new easydata.crud.EasyDataViewDispatcher().run()\n        });\n    <\/script>\n}\n'})}),"\n",(0,n.jsxs)(a.p,{children:["That\u2019s it. Now you can run your web app, open the ",(0,n.jsx)(a.code,{children:"/easydata"})," URL and enjoy CRUD functionality."]}),"\n",(0,n.jsx)(a.p,{children:"The result will be something like this:"}),"\n",(0,n.jsx)(a.h4,{id:"list-view-screen-for-one-entity",children:"List view screen for one entity:"}),"\n",(0,n.jsx)(a.p,{children:(0,n.jsx)(a.img,{alt:"List view screen for Orders entity",src:t(1070).Z+"",width:"1141",height:"641"})}),"\n",(0,n.jsx)(a.h4,{id:"edit-record-dialog",children:'"Edit Record" dialog:'}),"\n",(0,n.jsx)(a.p,{children:(0,n.jsx)(a.img,{alt:"Edit Record dialog",src:t(6925).Z+"",width:"1071",height:"907"})}),"\n",(0,n.jsx)(a.h4,{id:"lookup-dialog-was-opened-from-edit-record",children:'"Lookup" dialog (was opened from "Edit Record"):'}),"\n",(0,n.jsx)(a.p,{children:(0,n.jsx)(a.img,{alt:"Lookup dialog",src:t(4205).Z+"",width:"1244",height:"911"})}),"\n",(0,n.jsx)(a.h2,{id:"how-it-works",children:"How it works"}),"\n",(0,n.jsx)(a.p,{children:"Let's briefly go over how all this magic works.\nAs we mentioned before EasyData takes care of three main things:"}),"\n",(0,n.jsxs)(a.ul,{children:["\n",(0,n.jsxs)(a.li,{children:["\n",(0,n.jsx)(a.p,{children:"It collects database metadata."}),"\n"]}),"\n",(0,n.jsxs)(a.li,{children:["\n",(0,n.jsx)(a.p,{children:"It establishes an API for the main CRUD operations."}),"\n"]}),"\n",(0,n.jsxs)(a.li,{children:["\n",(0,n.jsx)(a.p,{children:"It renders UI (again, based on the metadata) and processes all user interactions in that UI."}),"\n"]}),"\n"]}),"\n",(0,n.jsx)(a.p,{children:"Let\u2019s explore all these parts in detail."}),"\n",(0,n.jsx)(a.h3,{id:"metadata",children:"Metadata"}),"\n",(0,n.jsx)(a.p,{children:"Metadata is the data about your data: what entities (tables) are stored in your database,\nhow they're connected, what attributes (fields) they have, what  the types of attributes are\nand what the constraints are with respect to the values we can store in those attributes."}),"\n",(0,n.jsxs)(a.p,{children:["EasyData collects metadata (in one way or another) and stores it in the instance of ",(0,n.jsx)(a.code,{children:"MetaData"})," class.\nThis object contains the list of entities (tables), the attributes (fields) for each entity, the connections between entities,\nand some additional information used in API and during UI rendering and processing."]}),"\n",(0,n.jsx)(a.p,{children:"To fill the MetaData object, we specify a metadata loader. In the example above, we did it with the UseDbContext call.\nSo, the metadata is loaded from a DbConext object. Currently (in version 1.2) this is the only metadata loader available.\nIn future versions, it will be possible to load metadata directly from a DbConnection object or perhaps with some other method."}),"\n",(0,n.jsx)(a.h3,{id:"easydata-middleware",children:"EasyData middleware"}),"\n",(0,n.jsx)(a.p,{children:"EasyData middleware is responsible for establishing a REST API for all CRUD (and not only) operations initiated by the client side."}),"\n",(0,n.jsxs)(a.p,{children:["To add the middleware to your pipeline use ",(0,n.jsx)(a.code,{children:"MapEasyData"})," extension function inside ",(0,n.jsx)(a.code,{children:"UseEndpoints"})," configuration delegate:"]}),"\n",(0,n.jsx)(a.pre,{children:(0,n.jsx)(a.code,{children:"   app.UseEndpoints(endpoints =>\n    {\n       endpoints.MapEasyData(options => {\n            options.UseDbContext<AppDbContext>();\n        });\n    }\n"})}),"\n",(0,n.jsxs)(a.p,{children:["This call should be made before ",(0,n.jsx)(a.code,{children:"MapMvc"})," or ",(0,n.jsx)(a.code,{children:"MapRazorPages"}),".\nBy default, EasyData middleware is assigned to ",(0,n.jsx)(a.code,{children:"/api/easydata endpoint"}),", but you can change it via the configuration function (action) passed in the parameter."]}),"\n",(0,n.jsxs)(a.p,{children:["The only thing that's required in order to configure for ",(0,n.jsx)(a.code,{children:"MapEasyData"})," is to tell it where to take the metadata.\nCurrently, there's just one option available: getting metadata from a DbContext.\nSo, that\u2019s why we add ",(0,n.jsx)(a.code,{children:"UseDbContext<AppDbContext>()"})," call in the example above.\nBesides getting metadata, ",(0,n.jsx)(a.code,{children:"UseDbContext"})," also provides our middleware with all the means for performing CRUD operations (via the DbContext object)."]}),"\n",(0,n.jsx)(a.h3,{id:"easydata-ui-root-page",children:"EasyData UI root page"}),"\n",(0,n.jsxs)(a.p,{children:['The third part of the EasyData setup process is the page where the CRUD user interface is rendered.\nIt must be a so-called "catch-all" Razor page or MVC view.\nBy default, this page must be opened for any path that starts with the ',(0,n.jsx)(a.code,{children:"/easydata/"})," prefix.\n(So, all paths like ",(0,n.jsx)(a.code,{children:"/easydata/student"})," or ",(0,n.jsx)(a.code,{children:"/easydata/invoice"})," must be processed by this page.)"]}),"\n",(0,n.jsxs)(a.p,{children:["NB: ",(0,n.jsx)(a.code,{children:"/easydata"})," is the default prefix.\nYou can use another name, but in this case, it will be necessary to specify it in the options of our ",(0,n.jsx)(a.code,{children:"RootDispatcherView"})," object."]}),"\n",(0,n.jsx)(a.p,{children:"Our catch-all page can contain any HTML element of your choice.\nHowever, to ensure the visualization and normal operation of the CRUD UI, it must include the following 4 elements:"}),"\n",(0,n.jsxs)(a.ul,{children:["\n",(0,n.jsxs)(a.li,{children:["\n",(0,n.jsxs)(a.p,{children:[(0,n.jsx)(a.code,{children:"<link>"})," element with a reference to EasyData CSS file (",(0,n.jsx)(a.code,{children:"easydata.min.cs"}),")"]}),"\n"]}),"\n",(0,n.jsxs)(a.li,{children:["\n",(0,n.jsxs)(a.p,{children:["Container (empty ",(0,n.jsx)(a.code,{children:"div"})," element), in which our interface will be displayed.\nBy default, it must have the ID ",(0,n.jsx)(a.code,{children:"EasyDataContainer"}),", but this can also be configured with options."]}),"\n"]}),"\n",(0,n.jsxs)(a.li,{children:["\n",(0,n.jsxs)(a.p,{children:[(0,n.jsx)(a.code,{children:"<script>"})," element with a reference to ",(0,n.jsx)(a.code,{children:"easydata.min.js"}),"."]}),"\n"]}),"\n",(0,n.jsxs)(a.li,{children:["\n",(0,n.jsxs)(a.p,{children:["And a small script that creates and launches the ",(0,n.jsx)(a.code,{children:"EasyDataViewDispatcher"})," object on page load."]}),"\n"]}),"\n"]}),"\n",(0,n.jsx)(a.p,{children:"An example of the simplest \u201ccatch-all\u201d page you can see in the Getting Started section above."}),"\n",(0,n.jsx)(a.h2,{id:"wrapping-up",children:"Wrapping up"}),"\n",(0,n.jsxs)(a.p,{children:["Currently, EasyData can work with .NET Core 3.1 and .NET 5.\nObviously, all ASP.NET Core and Entity Framework Core versions that can work with the specified releases of .NET (Core) are supported.\nHowever, it won't be a problem to add support for previous versions of .NET Core or even .NET Framework 4.x.\nIf anyone needs it, please ",(0,n.jsx)(a.a,{href:"https://github.com/KorzhCom/EasyData/issues",children:"submit an issue"})," in EasyData's GitHub repository."]}),"\n",(0,n.jsx)(a.p,{children:"EasyData can be a good tool with which to quickly prototype a new project or create a POC (proof of concept)\nwhen we already understand what data we'll need but don't want to spend a lot of time on the simplest operations with that data.\nHowever, we hope that in time it will be possible to fully use this solution in the production environment."}),"\n",(0,n.jsx)(a.p,{children:"So, we look forward to hearing from you with any comments or advice you may have. Of course, don't forget to ad a start for the EasyData repository on GitHub, especially if this library helped you and saved some time."}),"\n",(0,n.jsxs)(a.p,{children:["So, we look forward to hearing from you with any comments or advice you may have.\nOf course, don't forget to add a star for the ",(0,n.jsx)(a.a,{href:"https://github.com/KorzhCom/EasyData",children:"EasyData repository on GitHub"}),",\nespecially if this library helped you and saved some time."]})]})}function h(e={}){const{wrapper:a}={...(0,s.a)(),...e.components};return a?(0,n.jsx)(a,{...e,children:(0,n.jsx)(c,{...e})}):c(e)}},4735:(e,a,t)=>{t.d(a,{Z:()=>n});const n=t.p+"assets/images/db-objects-01-f87ae84c4f7fea1001ca1eb9d8f76b85.jpg"},1305:(e,a,t)=>{t.d(a,{Z:()=>n});const n=t.p+"assets/images/easydata-demo01-53f7ea9e49f80b56662188bca57e8664.gif"},1070:(e,a,t)=>{t.d(a,{Z:()=>n});const n=t.p+"assets/images/easydata-sshot01-4f12a74826605c5ba90a3542f6e84b52.jpg"},6925:(e,a,t)=>{t.d(a,{Z:()=>n});const n=t.p+"assets/images/easydata-sshot02-0634ad08d4b7cc8d93adabc43380007f.jpg"},4205:(e,a,t)=>{t.d(a,{Z:()=>n});const n=t.p+"assets/images/easydata-sshot03-c5f6f81aef755d682db8d1f70d5cf8e7.jpg"},1151:(e,a,t)=>{t.d(a,{Z:()=>r,a:()=>o});var n=t(7294);const s={},i=n.createContext(s);function o(e){const a=n.useContext(i);return n.useMemo((function(){return"function"==typeof e?e(a):{...a,...e}}),[a,e])}function r(e){let a;return a=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:o(e.components),n.createElement(i.Provider,{value:a},e.children)}}}]);