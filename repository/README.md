## Functions

<dl>
<dt><a href="#setConfig">setConfig(op)</a></dt>
<dd><p>共通変数設定</p>
</dd>
<dt><a href="#onInit">onInit()</a> ⇒ <code>void</code></dt>
<dd><p>イメージ設定、フレーム枠組み前の処理</p>
</dd>
<dt><a href="#onResize">onResize()</a> ⇒ <code>void</code></dt>
<dd><p>ウィンドリサイズ時の処理</p>
</dd>
<dt><a href="#molding">molding(mode, obj, save, ix)</a> ⇒ <code>void</code></dt>
<dd><p>枠組み（タグ）の生成</p>
</dd>
<dt><a href="#locating">locating(obj, ix, jx, direct)</a> ⇒ <code>void</code></dt>
<dd><p>タブの位置づけ</p>
</dd>
<dt><a href="#config">config(obj)</a> ⇒ <code>object</code></dt>
<dd><p>設定値の取り込み</p>
</dd>
</dl>

<a name="setConfig"></a>

## setConfig(op)
共通変数設定

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| op | <code>object</code> | 実行時オプション |

<a name="onInit"></a>

## onInit() ⇒ <code>void</code>
イメージ設定、フレーム枠組み前の処理

**Kind**: global function  
**Returns**: <code>void</code> - none  
<a name="onResize"></a>

## onResize() ⇒ <code>void</code>
ウィンドリサイズ時の処理

**Kind**: global function  
**Returns**: <code>void</code> - none  
<a name="molding"></a>

## molding(mode, obj, save, ix) ⇒ <code>void</code>
枠組み（タグ）の生成

**Kind**: global function  
**Returns**: <code>void</code> - none  

| Param | Type | Description |
| --- | --- | --- |
| mode | <code>string</code> | 端末種別(mobile/pc) |
| obj | <code>object</code> | タブ本体jQueryオブジェクト |
| save | <code>Object</code> | タブ別の持ち越し保存データ |
| ix | <code>number</code> | タブ番号 |

<a name="locating"></a>

## locating(obj, ix, jx, direct) ⇒ <code>void</code>
タブの位置づけ

**Kind**: global function  
**Returns**: <code>void</code> - none  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>object</code> | タブ本体jQueryオブジェクト |
| ix | <code>number</code> | タブ番号 |
| jx | <code>number</code> | ページ番号 |
| direct | <code>string</code> | 方向 |

<a name="config"></a>

## config(obj) ⇒ <code>object</code>
設定値の取り込み

**Kind**: global function  
**Returns**: <code>object</code> - 設定値  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>object</code> | タブjQueryオブジェクト |

