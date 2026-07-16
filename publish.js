const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'source/_posts'); 

const commonDirs = [
  'D:\\Documents\\OI\\算法·理论',
  'D:\\Documents\\OI\\题解',
  'D:\\Documents\\随笔',
];

const categoryMap = {
  '0': '随笔',
  '1': '算法·理论',
  '2': '题解',
};


const args = process.argv.slice(2);

// 如果什么都没输，打印出酷炫的帮助菜单
if (args.length < 1) {
  console.log('\n❌ 缺少参数！');
  console.log('💡 用法: publish <文件名> [分类代码]');
  console.log('\n👉 常用分类代码表:');
  for (let key in categoryMap) {
    console.log(`   [${key}] -> ${categoryMap[key]}`);
  }
  console.log('\n📝 示例: publish 我的文章 1');
  console.log('   (如果没有在代码表里的分类，直接打字也会原样写入)\n');
  process.exit(1);
}

const inputPath = args[0];
const rawCategory = args[1] || '0'; // 如果不输入分类，默认使用代码 '0'

// ✨ 核心逻辑：智能转换分类名
// 如果输入的代码在 map 里存在，就替换成完整名字。
// 如果不存在（比如你临时敲了一个“杂谈”），就直接用你输入的文字。
const category = categoryMap[rawCategory] || rawCategory;


let sourceFile = null;

if (fs.existsSync(inputPath)) {
  sourceFile = inputPath;
} else {
  const searchName = inputPath.toLowerCase().endsWith('.md') ? inputPath : `${inputPath}.md`;
  for (const dir of commonDirs) {
    const testPath = path.join(dir, searchName);
    if (fs.existsSync(testPath)) {
      sourceFile = testPath;
      break;
    }
  }
}

if (!sourceFile) {
  console.error(`\n❌ 找不到文件: "${inputPath}"\n`);
  process.exit(1);
}

// 读取、处理时间、合并头部的逻辑
const fileName = path.basename(sourceFile, '.md');
const stats = fs.statSync(sourceFile);
const dateObj = stats.birthtime.getFullYear() > 1970 ? stats.birthtime : stats.mtime; 

const pad = (n) => n.toString().padStart(2, '0');
const dateStr = `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(dateObj.getDate())} ${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}:${pad(dateObj.getSeconds())}`;

const originalContent = fs.readFileSync(sourceFile, 'utf-8');

// ✨ 在这里加入了 author 字段
const frontMatter = `---
title: ${fileName}
date: ${dateStr}
author: Hanbingqigu
categories:
  - ${category}
---

`;

const targetFile = path.join(targetDir, `${fileName}.md`);
fs.writeFileSync(targetFile, frontMatter + originalContent, 'utf-8');

console.log('\n🎉 博客发布成功！');
console.log('------------------------------------');
console.log(`📝 标题: ${fileName}`);
console.log(`👤 作者: Hanbingqigu`); // ✨ 增加了控制台作者打印
console.log(`📁 分类: ${category} (代码: ${rawCategory})`);
console.log(`⏰ 时间: ${dateStr}`);
console.log(`➡️ 输出: ${targetFile}`);
console.log('------------------------------------\n');