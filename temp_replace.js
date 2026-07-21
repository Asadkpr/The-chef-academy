const fs = require('fs');
const files = [
  "c:\\Users\\Malik\\Downloads\\the-chef's-academy-admission-portal (1)\\src\\components\\CMSAdmin.tsx",
  "c:\\Users\\Malik\\Downloads\\the-chef's-academy-admission-portal (1)\\src\\components\\AnnouncementPopup.tsx"
];

// Process CMSAdmin.tsx
let adminContent = fs.readFileSync(files[0], 'utf8');
adminContent = adminContent.replace(/bg-amber-[456]00/g, 'bg-[#AE8C45]');
adminContent = adminContent.replace(/hover:bg-amber-[456]00/g, 'hover:bg-[#C5A964]');
adminContent = adminContent.replace(/text-slate-950/g, 'text-[#0C1B2C]');
adminContent = adminContent.replace(/text-amber-[45]00/g, 'text-[#C5A964]');
adminContent = adminContent.replace(/bg-amber-500\/10/g, 'bg-[#AE8C45]/10');
adminContent = adminContent.replace(/hover:bg-amber-500\/20/g, 'hover:bg-[#AE8C45]/20');
adminContent = adminContent.replace(/border-amber-500\/30/g, 'border-[#AE8C45]/30');
adminContent = adminContent.replace(/border-amber-500/g, 'border-[#AE8C45]');
adminContent = adminContent.replace(/shadow-amber-500\/10/g, 'shadow-[#AE8C45]/10');
adminContent = adminContent.replace(/bg-\[\#c19d53\]/g, 'bg-[#AE8C45]');
adminContent = adminContent.replace(/hover:bg-\[\#d4b065\]/g, 'hover:bg-[#C5A964]');
adminContent = adminContent.replace(/text-amber-200/g, 'text-[#C5A964]');
fs.writeFileSync(files[0], adminContent, 'utf8');

// Process AnnouncementPopup.tsx
let popupContent = fs.readFileSync(files[1], 'utf8');
popupContent = popupContent.replace(/bg-amber-500 hover:bg-amber-400 text-slate-950/g, 'bg-[#AE8C45] hover:bg-[#C5A964] text-[#0C1B2C]');
popupContent = popupContent.replace(/shadow-amber-500\/20/g, 'shadow-[#AE8C45]/20');
popupContent = popupContent.replace(/from-amber-600 via-\[\#c19d53\] to-amber-400/g, 'from-[#AE8C45] via-[#C5A964] to-[#AE8C45]');
popupContent = popupContent.replace(/from-amber-500\/20 via-amber-400\/10 to-amber-600\/20/g, 'from-[#AE8C45]/20 via-[#C5A964]/10 to-[#AE8C45]/20');
popupContent = popupContent.replace(/bg-amber-500\/10 border border-amber-500\/20/g, 'bg-[#AE8C45]/10 border border-[#AE8C45]/20');
popupContent = popupContent.replace(/text-amber-400/g, 'text-[#C5A964]');
popupContent = popupContent.replace(/text-amber-500\/80/g, 'text-[#C5A964]/80');
popupContent = popupContent.replace(/text-amber-500\/70/g, 'text-[#C5A964]/70');
popupContent = popupContent.replace(/bg-amber-500/g, 'bg-[#AE8C45]');
popupContent = popupContent.replace(/hover:bg-amber-400/g, 'hover:bg-[#C5A964]');
popupContent = popupContent.replace(/text-slate-950/g, 'text-[#0C1B2C]');
fs.writeFileSync(files[1], popupContent, 'utf8');

console.log('Colors replaced successfully');
