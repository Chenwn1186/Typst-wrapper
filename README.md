# Typst Wrapper

中文 | English

## 中文介绍

Typst Wrapper 是一个面向 VS Code 的 Typst 编辑辅助扩展，用于将当前选中的 Typst 内容快速包裹到常见函数或用户自定义函数中，减少重复手写模板的操作。

### 当前功能

- 在 Typst 文件中选中文本后，可通过右键菜单打开 Typst Wrapper 子菜单。
- 提供常用 Typst 包裹命令，覆盖文本样式、装饰、上下标、颜色、对齐、布局和文档元素等场景。
- 支持从当前文件中检测用户通过 #let 定义的函数，并在菜单中动态选择后包裹选区。
- 对多行选区进行缩进处理，尽量保持包裹后的块结构整洁。

### 内置包裹命令

当前版本内置以下 Typst 包裹命令：

- #strong
- #emph
- #lower
- #upper
- #raw
- #highlight
- #underline
- #strike
- #overline
- #sub
- #super
- #smallcaps
- #text(fill: red)
- #text(fill: blue)
- #align(center)
- #align(left)
- #align(right)
- #box
- #block(width: 100%)
- #rect
- #rect(stroke: (paint: black, dash: "dashed", thickness: 1.6pt))
- #pad(x: 5pt)
- #columns(2)
- #link("")
- #footnote
- #quote

### 用户自定义函数

扩展会扫描当前 Typst 文档中的如下定义：

```typst
#let my-style(body) = ...
#let my-box = ...
```

识别后会在 User Functions 菜单中列出可选项。

- 如果函数带参数签名，例如 #let my-style(body) = ...，则插入形式为 #my-style()[]。
- 如果函数不带参数签名，例如 #let my-box = ...，则插入形式为 #my-box[]。

### 使用方式

1. 在 VS Code 中打开 Typst 文件。
2. 选中一段 Typst 内容。
3. 右键，选择 Typst Wrapper。
4. 在子菜单中选择一个内置命令，或选择 User Functions。

### 触发条件

- 仅在 Typst 文件中生效。
- 仅在编辑器存在选区时显示右键菜单入口。

### 开发与调试

仓库已包含基础扩展开发配置：

- 入口文件：extension.js
- 扩展清单：package.json
- 调试配置：.vscode/launch.json

可在 VS Code 中直接启动扩展开发宿主进行调试。

### 当前限制

- 用户自定义函数检测基于 #let 的简单正则匹配。
- 当前仅从当前打开文档中提取用户函数，不扫描项目内其他 Typst 文件。
- 目前主要通过右键菜单触发，尚未提供快捷键或命令面板分类说明。

## English

Typst Wrapper is a VS Code extension for Typst authoring. It helps you quickly wrap selected Typst content with common built-in wrappers or user-defined functions, reducing repetitive manual template editing.

### Features

- Adds a Typst Wrapper submenu to the editor context menu when text is selected in a Typst file.
- Provides common Typst wrappers for text styling, decoration, script, color, alignment, layout, and document elements.
- Detects user-defined functions declared with #let in the current file and lets you wrap the selection with them.
- Preserves structure for multi-line selections by applying indentation handling during wrapping.

### Built-in Wrappers

The current version includes the following built-in wrappers:

- #strong
- #emph
- #lower
- #upper
- #raw
- #highlight
- #underline
- #strike
- #overline
- #sub
- #super
- #smallcaps
- #text(fill: red)
- #text(fill: blue)
- #align(center)
- #align(left)
- #align(right)
- #box
- #block(width: 100%)
- #rect
- #rect(stroke: (paint: black, dash: "dashed", thickness: 1.6pt))
- #pad(x: 5pt)
- #columns(2)
- #link("")
- #footnote
- #quote

### User-Defined Functions

The extension scans the current Typst document for definitions such as:

```typst
#let my-style(body) = ...
#let my-box = ...
```

Detected functions are listed under the User Functions menu.

- If the function has a signature, such as #let my-style(body) = ..., the wrapper format becomes #my-style()[].
- If the function has no signature, such as #let my-box = ..., the wrapper format becomes #my-box[].

### Usage

1. Open a Typst file in VS Code.
2. Select some Typst content.
3. Right-click and open Typst Wrapper.
4. Choose a built-in wrapper or User Functions.

### Activation Conditions

- Active only in Typst files.
- The context menu entry appears only when the editor has a selection.

### Development and Debugging

This repository already includes the basic extension development setup:

- Entry file: extension.js
- Extension manifest: package.json
- Debug configuration: .vscode/launch.json

You can launch the Extension Development Host directly from VS Code for debugging.

### Current Limitations

- User-defined function detection is based on a simple #let regular expression.
- User functions are detected only from the current open document, not from other Typst files in the workspace.
- The current interaction is centered on the context menu and does not yet provide documented keybindings.