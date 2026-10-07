/**
 * VoiceFlow AI - Interactive Flow Builder Engine
 */

class FlowBuilderEngine {
    constructor(canvasId, svgId) {
        this.canvas = document.getElementById(canvasId);
        this.svg = document.getElementById(svgId);
        this.nodes = [];
        this.connections = [];
        this.selectedNode = null;
        this.draggedNodeType = null;
        this.history = [];
        
        this.initEventListeners();
    }

    initEventListeners() {
        window.addEventListener('resize', () => this.renderConnections());
    }

    addNode(type, x, y, config = {}) {
        const nodeId = 'node_' + Math.random().toString(36).substr(2, 9);
        const nodeData = {
            id: nodeId,
            type: type,
            x: x,
            y: y,
            title: config.title || type,
            data: config.data || {}
        };

        this.nodes.push(nodeData);
        this.renderNodeHTML(nodeData);
        this.saveState();
        return nodeData;
    }

    renderNodeHTML(node) {
        const nodeEl = document.createElement('div');
        nodeEl.id = node.id;
        nodeEl.className = 'absolute bg-slate-900 border border-slate-700 rounded-xl p-4 w-60 shadow-xl cursor-move z-20 hover:border-brand-500 transition-all';
        nodeEl.style.left = `${node.x}px`;
        nodeEl.style.top = `${node.y}px`;

        nodeEl.innerHTML = `
            <div class="flex justify-between items-center border-b border-slate-800 pb-2 mb-3">
                <span class="text-xs font-bold text-brand-400 uppercase tracking-wider">${node.type}</span>
                <button onclick="flowEngine.deleteNode('${node.id}')" class="text-slate-500 hover:text-rose-500 text-xs"><i class="fa-solid fa-trash"></i></button>
            </div>
            <div class="text-xs font-medium text-slate-200 mb-2">${node.title}</div>
            <div class="flex justify-between items-center mt-4 pt-2 border-t border-slate-800/60">
                <div class="node-port bg-emerald-500 cursor-pointer" title="Input Port"></div>
                <div class="node-port bg-brand-500 cursor-pointer" title="Output Port" onclick="flowEngine.startConnection('${node.id}')"></div>
            </div>
        `;

        this.makeNodeDraggable(nodeEl, node);
        document.getElementById('canvas-nodes-layer').appendChild(nodeEl);
    }

    makeNodeDraggable(element, nodeData) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        element.onmousedown = (e) => {
            if (e.target.classList.contains('node-port')) return;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = () => {
                document.onmouseup = null;
                document.onmousemove = null;
                this.saveState();
            };
            document.onmousemove = (e) => {
                e.preventDefault();
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                
                nodeData.x = element.offsetLeft - pos1;
                nodeData.y = element.offsetTop - pos2;
                
                element.style.left = `${nodeData.x}px`;
                element.style.top = `${nodeData.y}px`;
                this.renderConnections();
            };
        };
    }

    deleteNode(nodeId) {
        this.nodes = this.nodes.filter(n => n.id !== nodeId);
        this.connections = this.connections.filter(c => c.from !== nodeId && c.to !== nodeId);
        const element = document.getElementById(nodeId);
        if (element) element.remove();
        this.renderConnections();
        this.saveState();
    }

    connectNodes(fromId, toId) {
        if (fromId === toId) return;
        this.connections.push({ from: fromId, to: toId });
        this.renderConnections();
    }

    renderConnections() {
        this.svg.innerHTML = '';
        this.connections.forEach(conn => {
            const fromEl = document.getElementById(conn.from);
            const toEl = document.getElementById(conn.to);
            
            if (fromEl && toEl) {
                const x1 = fromEl.offsetLeft + fromEl.offsetWidth;
                const y1 = fromEl.offsetTop + (fromEl.offsetHeight / 2);
                const x2 = toEl.offsetLeft;
                const y2 = toEl.offsetTop + (toEl.offsetHeight / 2);

                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                const dx = Math.abs(x2 - x1) * 0.5;
                const d = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
                
                path.setAttribute('d', d);
                path.setAttribute('stroke', '#3b82f6');
                path.setAttribute('stroke-width', '2.5');
                path.setAttribute('fill', 'none');
                this.svg.appendChild(path);
            }
        });
    }

    saveState() {
        this.history.push(JSON.stringify({ nodes: this.nodes, connections: this.connections }));
    }
}

// Global Builder Instance
let flowEngine;
document.addEventListener('DOMContentLoaded', () => {
    flowEngine = new FlowBuilderEngine('canvas-container', 'svg-connections');
});

// UI Event Handlers
function allowDrop(ev) { ev.preventDefault(); }
function dragNode(ev, nodeType) { ev.dataTransfer.setData("nodeType", nodeType); }
function dropNode(ev) {
    ev.preventDefault();
    const nodeType = ev.dataTransfer.getData("nodeType");
    const rect = document.getElementById('canvas-container').getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    flowEngine.addNode(nodeType, x, y);
}

function switchView(viewName) {
    document.querySelectorAll('.view-panel').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.remove('bg-brand-600/10', 'text-brand-500', 'border', 'border-brand-500/20');
        el.classList.add('text-slate-400');
    });
    
    const activeView = document.getElementById(`view-${viewName}`);
    if (activeView) activeView.classList.remove('hidden');
}

function toggleAICommandCenter() {
    document.getElementById('ai-command-modal').classList.toggle('hidden');
}

function executeAIGeneration() {
    toggleAICommandCenter();
    // Programmatic generation of nodes based on AI Parsing Engine
    flowEngine.addNode('START', 100, 100, { title: 'Incoming Call' });
    flowEngine.addNode('GREETING', 380, 100, { title: 'Karibu Hospitali' });
    flowEngine.addNode('MENU', 660, 100, { title: '1: Emergency, 2: Doctor' });
    flowEngine.connectNodes(flowEngine.nodes[0].id, flowEngine.nodes[1].id);
    flowEngine.connectNodes(flowEngine.nodes[1].id, flowEngine.nodes[2].id);
}