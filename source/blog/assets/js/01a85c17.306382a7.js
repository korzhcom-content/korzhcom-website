"use strict";(self.webpackChunkblog=self.webpackChunkblog||[]).push([[8209],{2482:(e,s,t)=>{t.r(s),t.d(s,{default:()=>p});t(6540);var a=t(4164),i=t(3230);const r=()=>(0,i.T)({id:"theme.tags.tagsPageTitle",message:"Tags",description:"The title of the tag list page"});var l=t(6644),n=t(8630),c=t(5594),d=t(1883),o=t(5225);const m={tag:"tag_Nnez"};var h=t(4848);function u(e){let{letterEntry:s}=e;return(0,h.jsxs)("article",{children:[(0,h.jsx)(o.A,{as:"h2",id:s.letter,children:s.letter}),(0,h.jsx)("ul",{className:"padding--none",children:s.tags.map((e=>(0,h.jsx)("li",{className:m.tag,children:(0,h.jsx)(d.A,{...e})},e.permalink)))}),(0,h.jsx)("hr",{})]})}function g(e){let{tags:s}=e;const t=function(e){const s={};return Object.values(e).forEach((e=>{const t=function(e){return e[0].toUpperCase()}(e.label);s[t]??=[],s[t].push(e)})),Object.entries(s).sort(((e,s)=>{let[t]=e,[a]=s;return t.localeCompare(a)})).map((e=>{let[s,t]=e;return{letter:s,tags:t.sort(((e,s)=>e.label.localeCompare(s.label)))}}))}(s);return(0,h.jsx)("section",{className:"margin-vert--lg",children:t.map((e=>(0,h.jsx)(u,{letterEntry:e},e.letter)))})}var b=t(1210);function p(e){let{tags:s,sidebar:t}=e;const i=r();return(0,h.jsxs)(l.e3,{className:(0,a.A)(n.G.wrapper.blogPages,n.G.page.blogTagsListPage),children:[(0,h.jsx)(l.be,{title:i}),(0,h.jsx)(b.A,{tag:"blog_tags_list"}),(0,h.jsxs)(c.A,{sidebar:t,children:[(0,h.jsx)(o.A,{as:"h1",children:i}),(0,h.jsx)(g,{tags:s})]})]})}},1883:(e,s,t)=>{t.d(s,{A:()=>n});t(6540);var a=t(4164),i=t(4783);const r={tag:"tag_zVej",tagRegular:"tagRegular_sFm0",tagWithCount:"tagWithCount_h2kH"};var l=t(4848);function n(e){let{permalink:s,label:t,count:n,description:c}=e;return(0,l.jsxs)(i.A,{href:s,title:c,className:(0,a.A)(r.tag,n?r.tagWithCount:r.tagRegular),children:[t,n&&(0,l.jsx)("span",{children:n})]})}},5594:(e,s,t)=>{t.d(s,{A:()=>o});t(6540);var a=t(4164),i=t(4475),r=t(6342),l=t(4589),n=t(4848);const c={dots:!0,infinite:!0,speed:500,slidesToShow:1,slidesToScroll:1,accessibility:!0,adaptiveHeight:!0,autoplay:!0,autoplaySpeed:5e3};function d(){return(0,n.jsxs)(l.A,{...c,children:[(0,n.jsxs)("div",{className:"slider__slide",children:[(0,n.jsx)("div",{className:"slider__slide-text",children:"Adaptive CRUD for ASP.NET Core web apps. 10 minutes to set up. Open-source!"}),(0,n.jsx)("div",{children:(0,n.jsx)("a",{className:"slider__slide-action",href:"https://github.com/KorzhCom/EasyData?utm_source=blog&utm_medium=content&utm_campaign=kblog_banner",children:"Get EasyData Now!"})})]}),(0,n.jsxs)("div",{className:"slider__slide",children:[(0,n.jsx)("div",{className:"slider__slide-text",children:"Don't build reporting functionality from scratch. Use our ready-made solution template for ASP.NET Core!"}),(0,n.jsx)("div",{children:(0,n.jsx)("a",{className:"slider__slide-action",href:"https://korzh.com/easy-report-starter-kit?utm_source=blog&utm_medium=content&utm_campaign=kblog_banner",children:"Get EasyReport Starter KIT!"})})]}),(0,n.jsxs)("div",{className:"slider__slide",children:[(0,n.jsx)("div",{className:"slider__slide-text",children:"Need advanced search or data filtering functionality in your .NET project? EasyQuery to the resque!"}),(0,n.jsx)("div",{children:(0,n.jsx)("a",{className:"slider__slide-action",href:"https://korzh.com/easyquery?utm_source=blog&utm_medium=content&utm_campaign=kblog_banner",children:"Install EasyQuery!"})})]})]})}function o(e){const{sidebar:s,toc:t,children:l,...c}=e,o=s&&s.items.length>0;return(0,n.jsx)(i.A,{...c,children:(0,n.jsx)("div",{className:"container margin-vert--lg",children:(0,n.jsxs)("div",{className:"row",children:[(0,n.jsx)(r.A,{sidebar:s}),(0,n.jsx)("main",{className:(0,a.A)("col",{"col--6":o,"col--9 col--offset-1":!o}),children:l}),!t&&(0,n.jsx)("div",{className:"col col--3",style:{padding:0},children:(0,n.jsx)(d,{})}),t&&(0,n.jsxs)("div",{className:"col col--3 right-sidebar",children:[(0,n.jsx)(d,{}),(0,n.jsx)("h4",{style:{marginTop:40},children:"Table of Contents"}),t]})]})})})}},6383:(e,s,t)=>{t.d(s,{A:()=>c});t(6540);var a=t(4164),i=t(4783),r=t(3230);const l={sidebar:"sidebar_brwN",sidebarItemTitle:"sidebarItemTitle_r4Q1",sidebarItemList:"sidebarItemList_QwSx",sidebarItem:"sidebarItem_lnhn",sidebarItemLink:"sidebarItemLink_yNGZ",sidebarItemLinkActive:"sidebarItemLinkActive_oSRm"};t(9813);var n=t(4848);function c(e){let{sidebar:s}=e;return(0,n.jsx)("aside",{className:"col col--3",children:(0,n.jsxs)("nav",{className:(0,a.A)(l.sidebar,"thin-scrollbar"),"aria-label":(0,r.T)({id:"theme.blog.sidebar.navAriaLabel",message:"Blog recent posts navigation",description:"The ARIA label for recent posts in the blog sidebar"}),children:[(0,n.jsx)("div",{className:(0,a.A)(l.sidebarItemTitle,"margin-bottom--md"),children:s.title}),(0,n.jsx)("ul",{className:(0,a.A)(l.sidebarItemList,"clean-list"),children:s.items.map((e=>(0,n.jsx)("li",{className:l.sidebarItem,children:(0,n.jsx)(i.A,{isNavLink:!0,to:e.permalink,className:l.sidebarItemLink,activeClassName:l.sidebarItemLinkActive,children:e.title})},e.permalink)))})]})})}}}]);