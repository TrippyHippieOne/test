"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
require("./App.css");
const react_1 = require("react");
function App() {
    const [data, setData] = (0, react_1.useState)([]);
    const [inputValue, setInputValue] = (0, react_1.useState)('');
    const [error, setError] = (0, react_1.useState)(null);
    const [selectedItems, setSelectedItems] = (0, react_1.useState)(new Set());
    const [skip, setSkip] = (0, react_1.useState)(0);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        setSkip(0);
    };
    const fetchData = (searchQuery, skipCount) => {
        setLoading(true);
        fetch(`https://vk-testing-api.vk-mini-apps-dev.magicgophers.com/?take=15&skip=${skipCount}&query=${searchQuery}`)
            .then(response => response.json())
            .then(newData => {
            setData(prevData => [...prevData, ...(newData.items || [])]);
            setSkip(prevSkip => prevSkip + (newData.items ? newData.items.length : 0));
            setLoading(false);
        })
            .catch(error => {
            setError(error.message);
            setLoading(false);
        });
    };
    (0, react_1.useEffect)(() => {
        fetchData(inputValue, 0);
    }, [inputValue]);
    const handleCheckboxChange = (itemValue) => {
        setSelectedItems(prevSelectedItems => {
            const newSelectedItems = new Set(prevSelectedItems);
            if (newSelectedItems.has(itemValue)) {
                newSelectedItems.delete(itemValue);
            }
            else {
                newSelectedItems.add(itemValue);
            }
            return newSelectedItems;
        });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        setSelectedItems(new Set());
        setInputValue('');
        setData([]);
        setSkip(0);
        setError(null);
    };
    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollHeight - scrollTop <= clientHeight * 1.05 && !loading) {
            fetchData(inputValue, skip);
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: 'mini-app', children: [(0, jsx_runtime_1.jsxs)("div", { className: 'header', children: [(0, jsx_runtime_1.jsxs)("div", { className: 'base-panelheader', children: [(0, jsx_runtime_1.jsxs)("div", { className: 'status-bar', children: [(0, jsx_runtime_1.jsx)("div", { className: "time", children: "9:41" }), (0, jsx_runtime_1.jsxs)("div", { className: "status-icons", children: [(0, jsx_runtime_1.jsx)("div", { className: "cellular-connection" }), (0, jsx_runtime_1.jsx)("div", { className: "wifi" }), (0, jsx_runtime_1.jsx)("div", { className: "battery" })] })] }), (0, jsx_runtime_1.jsx)("div", { className: 'layout', children: (0, jsx_runtime_1.jsx)("div", { className: 'content-panelheader', children: (0, jsx_runtime_1.jsxs)("div", { className: 'buttons', children: [(0, jsx_runtime_1.jsx)("button", { className: 'button-more', children: (0, jsx_runtime_1.jsx)("span", { className: "dots", children: "\u2022\u2022\u2022" }) }), (0, jsx_runtime_1.jsx)("div", { className: 'separator' }), (0, jsx_runtime_1.jsx)("button", { className: 'button-cancel', children: (0, jsx_runtime_1.jsx)("span", { className: "close", children: "\u2716" }) })] }) }) })] }), (0, jsx_runtime_1.jsx)("h1", { className: 'label', children: "Mini App" })] }), (0, jsx_runtime_1.jsxs)("div", { className: 'body', children: [(0, jsx_runtime_1.jsx)("form", { className: 'input-form', children: (0, jsx_runtime_1.jsx)("input", { className: 'input-name', type: "text", value: inputValue, onChange: handleInputChange, placeholder: '\u0418\u043C\u044F' }) }), (0, jsx_runtime_1.jsx)("div", { className: "spacer" }), inputValue && (0, jsx_runtime_1.jsx)("div", { className: 'checkbox-button-form', children: (0, jsx_runtime_1.jsx)("div", { className: 'checkbox-form', onScroll: handleScroll, children: data.map(item => ((0, jsx_runtime_1.jsxs)("label", { className: 'check-label', children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: selectedItems.has(item.value), onChange: () => handleCheckboxChange(item.value) }), item.label] }, item.value))) }) }), (0, jsx_runtime_1.jsx)("div", { className: 'button-block', children: (0, jsx_runtime_1.jsx)("button", { className: 'send-button', onClick: handleSubmit, type: 'button', disabled: selectedItems.size === 0, children: (0, jsx_runtime_1.jsx)("span", { className: 'text-button', children: "\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C" }) }) }), (0, jsx_runtime_1.jsx)("div", { className: 'iphone-indicator' })] })] }));
}
exports.default = App;
