// ==UserScript==
// @name         Yahoo 新聞圖片縮圖取代
// @namespace    http://tampermonkey.net/
// @version      2025-12-12
// @description  try to take over the world!
// @author       You
// @match        https://tw.news.yahoo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yahoo.com
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const IMAGES = [
    'https://megapx-assets.dcard.tw/images/847f4cae-5687-4372-b67d-07aecf6af1a2/640.webp',
    'https://img.technews.tw/wp-content/uploads/2025/11/25165135/chihuahuas-DOG-768x511.jpg'
  ];

  function pickRandom() {
    return IMAGES[Math.floor(Math.random() * IMAGES.length)];
  }

  function shouldReplace(img) {
    const alt = (img.getAttribute('alt') || '').trim();
    return alt.length >= 5;
  }

  function setPicture(pic, url) {
    const img = pic.querySelector('img');
    if (!img) return;

    img.src = url;
    img.srcset = url;
    img.setAttribute('data-src', url);
    img.setAttribute('data-srcset', url);

    pic.querySelectorAll('source').forEach(s => {
      s.srcset = url;
      s.setAttribute('data-srcset', url);
    });
  }

  function replace(root = document) {
    root.querySelectorAll('picture').forEach(pic => {
      const img = pic.querySelector('img');
      if (!img || !shouldReplace(img)) return;

      // ✅ 重要：避免 observer 觸發時同一張圖被反覆改掉（閃來閃去）
      if (img.dataset.tmRandomReplaced === '1') return;

      const url = pickRandom();
      setPicture(pic, url);

      img.dataset.tmRandomReplaced = '1';
    });
  }

  replace();

  const observer = new MutationObserver(muts => {
    for (const m of muts) {
      for (const node of m.addedNodes) {
        if (node.nodeType === 1) replace(node);
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();