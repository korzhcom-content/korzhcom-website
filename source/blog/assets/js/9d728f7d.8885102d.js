"use strict";(self.webpackChunkblog=self.webpackChunkblog||[]).push([[7408],{4137:(e,t,r)=>{r.d(t,{Zo:()=>c,kt:()=>g});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function s(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function i(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var l=n.createContext({}),p=function(e){var t=n.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):s(s({},t),e)),r},c=function(e){var t=p(e.components);return n.createElement(l.Provider,{value:t},e.children)},m="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},u=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),m=p(r),u=a,g=m["".concat(l,".").concat(u)]||m[u]||d[u]||o;return r?n.createElement(g,s(s({ref:t},c),{},{components:r})):n.createElement(g,s({ref:t},c))}));function g(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,s=new Array(o);s[0]=u;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i[m]="string"==typeof e?e:a,s[1]=i;for(var p=2;p<o;p++)s[p]=r[p];return n.createElement.apply(null,s)}return n.createElement.apply(null,r)}u.displayName="MDXCreateElement"},283:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>l,contentTitle:()=>s,default:()=>d,frontMatter:()=>o,metadata:()=>i,toc:()=>p});var n=r(7462),a=(r(7294),r(4137));const o={title:"ASP.NET Identity - Adding master password",tags:["ASP-NET-CORE","ASP-NET-IDENTITY","PASSWORD-HASHER"],slug:"aspnet-identity-master-password"},s="ASP.NET Identity: Adding master password",i={permalink:"/blog/aspnet-identity-master-password",source:"@site/blog/2018-04-08-aspnet-identity-master-password/index.md",title:"ASP.NET Identity - Adding master password",description:"Problem",date:"2018-04-08T00:00:00.000Z",formattedDate:"April 8, 2018",tags:[{label:"ASP-NET-CORE",permalink:"/blog/tags/asp-net-core"},{label:"ASP-NET-IDENTITY",permalink:"/blog/tags/asp-net-identity"},{label:"PASSWORD-HASHER",permalink:"/blog/tags/password-hasher"}],readingTime:.785,hasTruncateMarker:!0,authors:[],frontMatter:{title:"ASP.NET Identity - Adding master password",tags:["ASP-NET-CORE","ASP-NET-IDENTITY","PASSWORD-HASHER"],slug:"aspnet-identity-master-password"},prevItem:{title:"Using embedded resources in testing projects",permalink:"/blog/embedded-resources-testing-projects"},nextItem:{title:"ASP.NET Identity - Migrating users' passwords from ASP.NET Membership",permalink:"/blog/aspnet-identity-migrate-membership-passwords"}},l={authorsImageUrls:[]},p=[{value:"Problem",id:"problem",level:2}],c={toc:p},m="wrapper";function d(e){let{components:t,...o}=e;return(0,a.kt)(m,(0,n.Z)({},c,o,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,(0,a.kt)("img",{src:r(7734).Z,width:"1280",height:"896"})),(0,a.kt)("h2",{id:"problem"},"Problem"),(0,a.kt)("p",null,'Sometimes, when you build a multi-tenant web-application you may need to set up a "master password" to your system - the password which allows some administrator to login to any user\'s account. Something similar to ',(0,a.kt)("inlineCode",{parentName:"p"},"su")," command in Unix/Linux systems."))}d.isMDXComponent=!0},7734:(e,t,r)=>{r.d(t,{Z:()=>n});const n=r.p+"assets/images/password-master-dc1a42fe09613d08b264ad7d8910ebb7.jpg"}}]);