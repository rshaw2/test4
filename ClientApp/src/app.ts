import { dia, setTheme, shapes, ui, linkTools } from '@clientio/rappid';
import { Table, Link } from './shapes';
import { anchorNamespace } from './anchors';
import { routerNamespace } from './routers';
import { TableHighlighter } from './highlighters';

export const init = () => {

    const appEl = document.getElementById('app') as HTMLElement;
    const canvasEl = document.querySelector('.canvas') as HTMLElement;

    setTheme('my-theme');

    const graph = new dia.Graph({}, { cellNamespace: shapes });

    const paper = new dia.Paper({
        model: graph,
        width: 1000,
        height: 800,
        gridSize: 20,
        interactive: true,
        defaultConnector: { name: 'rounded' },
        async: true,
        frozen: true,
        sorting: dia.Paper.sorting.APPROX,
        cellViewNamespace: shapes,
        routerNamespace: routerNamespace,
        defaultRouter: { name: 'customRouter' },
        anchorNamespace: anchorNamespace,
        defaultAnchor: { name: 'customAnchor' },
        snapLinks: true,
        linkPinning: false,
        magnetThreshold: 'onleave',
        highlighting: {
            'connecting': {
                name: 'addClass',
                options: {
                    className: 'column-connected'
                }
            }
        },
        defaultLink: () => new Link(),
        validateConnection: function (srcView, srcMagnet, tgtView, tgtMagnet) {
            // console.log("validateConnection");
            return srcMagnet !== tgtMagnet;
        }
    });

    const scroller = new ui.PaperScroller({
        paper,
        cursor: 'grab',
        baseWidth: 10,
        baseHeight: 10,
        inertia: { friction: 0.8 },
        autoResizePaper: true,
        contentOptions: function () {
            return {
                useModelGeometry: true,
                allowNewOrigin: 'any',
                padding: 40,
                allowNegativeBottomRight: true
            };
        }
    });

    canvasEl.appendChild(scroller.el);
    scroller.render().center();

    const users = new Table()
        .setName('users')
        .setTabColor('#6495ED')
        .position(170, 220)
        .setColumns([
            { name: 'id', type: 'int', key: true },
            { name: 'full_name', type: 'varchar' },
            { name: 'created_at', type: 'datetime' },
            { name: 'country_code', type: 'int' }
        ])
        .addTo(graph);

    const orders = new Table()
        .setName('orders')
        .setTabColor('#008B8B')
        .position(570, 140)
        .setColumns([
            { name: 'user_id', type: 'int', key: true },
            { name: 'status', type: 'varchar' },
            { name: 'product_id', type: 'int' },
            { name: 'created_at', type: 'datetime' }
        ])
        .addTo(graph);

    const countries = new Table()
        .setName('countries')
        .setTabColor('#CD5C5C')
        .position(170, 540)
        .setColumns([
            { name: 'code', type: 'int', key: true },
            { name: 'name', type: 'varchar' }
        ])
        .addTo(graph);

    const products = new Table()
        .setName('products')
        .setTabColor('#FFD700')
        .position(570, 440)
        .setColumns([
            { name: 'id', type: 'int', key: true },
            { name: 'name', type: 'varchar' },
            { name: 'price', type: 'int' },
            { name: 'status', type: 'varchar' },
            { name: 'created_at', type: 'datetime' }
        ])
        .addTo(graph);

    const links = [
        new Link({
            source: { id: users.id, port: 'id' },
            target: { id: orders.id, port: 'user_id' }
        }),
        new Link({
            source: { id: countries.id, port: 'code' },
            target: { id: users.id, port: 'country_code' }
        }),
        new Link({
            source: { id: products.id, port: 'id' },
            target: { id: orders.id, port: 'product_id' }
        })
    ];

    links.forEach((link) => {
        link.addTo(graph);
    });

    const btnLoadG = document.getElementById('btnLoadG');

    btnLoadG?.addEventListener('click', () => {
        graph.fromJSON(JSON.parse((document.getElementById('json') as HTMLTextAreaElement).value));
    });

    // Register events
    paper.on('render:done', (stats, opt) => {
        // console.log(stats);
        // console.log(opt);
    });

    paper.on('link:mouseenter', (linkView: dia.LinkView) => {
        showLinkTools(linkView);
    });

    paper.on('link:mouseleave', (linkView: dia.LinkView) => {
        linkView.removeTools();
    });

    paper.on('link:connect', (linkView: dia.LinkView, evt: dia.Event, newCellView: dia.CellView, newCellViewMagnet: SVGElement, arrowhead: dia.LinkEnd) => {
        const link = linkView.model,
            sourceId = link.get('source'),
            targetId = link.get('target');
        console.log('sourceId', sourceId);
        console.log('targetId', targetId);

        // console.log('linkView', linkView);
        // console.log('evt', evt);
        // console.log('newCellView', newCellView);
        // console.log('newCellViewMagnet', newCellViewMagnet);
        // console.log('arrowhead', arrowhead);
    });

    paper.on('link:snap:connect', (linkView: dia.LinkView, evt: dia.Event, newCellView: dia.CellView, newCellViewMagnet: SVGElement, arrowhead: dia.LinkEnd) => {
        // console.log('snap-linkView', linkView);
        // console.log('snap-evt', evt);
        // console.log('snap-newCellView', newCellView);
        // console.log('snap-newCellViewMagnet', newCellViewMagnet);
        // console.log('snap-arrowhead', arrowhead);
    });

    paper.on('link:disconnect', (linkView: dia.LinkView, evt: dia.Event, prevCellView: dia.CellView, prevCellViewMagnet: SVGElement, arrowhead: dia.LinkEnd) => {
        // const link = linkView.model,
        //     sourceId = link.get('source'),
        //     targetId = link.get('target');
        // console.log('sourceId', sourceId);
        // console.log('targetId', targetId);

        console.log('linkView', linkView);
        console.log('evt', evt);
        console.log('prevCellView', prevCellView);
        console.log('prevCellViewMagnet', prevCellViewMagnet);
        console.log('arrowhead', arrowhead);
    });

    paper.on('link:snap:disconnect', (linkView: dia.LinkView, evt: dia.Event, prevCellView: dia.CellView, prevCellViewMagnet: SVGElement, arrowhead: dia.LinkEnd) => {
        // console.log('linkView', linkView);
        // console.log('evt', evt);
        // console.log('prevCellView', prevCellView);
        // console.log('prevCellViewMagnet', prevCellViewMagnet);
        // console.log('arrowhead', arrowhead);
    });

    paper.on('blank:pointerdown', (evt: dia.Event) => scroller.startPanning(evt));

    paper.on('blank:mousewheel', (evt: dia.Event, ox: number, oy: number, delta: number) => {
        evt.preventDefault();
        zoom(ox, oy, delta);
    });

    paper.on('cell:mousewheel', (_, evt: dia.Event, ox: number, oy: number, delta: number) => {
        evt.preventDefault();
        zoom(ox, oy, delta);
    });

    function zoom(x: number, y: number, delta: number) {
        scroller.zoom(delta * 0.2, { min: 0.4, max: 3, grid: 0.2, ox: x, oy: y });
    }

    paper.on('element:pointerclick', (elementView: dia.ElementView) => {
        editTable(elementView);
    });

    paper.on('blank:pointerdblclick', (evt: dia.Event, x: number, y: number) => {
        const table = new Table();
        table.position(x, y);
        table.setColumns([{
            name: 'id',
            type: 'int'
        }]);
        table.addTo(graph);
        editTable(table.findView(paper) as dia.ElementView);
    });

    paper.unfreeze();

    // Actions
    function showLinkTools(linkView: dia.LinkView) {
        const tools = new dia.ToolsView({
            tools: [
                new linkTools.Remove({
                    distance: '50%',
                    markup: [{
                        tagName: 'circle',
                        selector: 'button',
                        attributes: {
                            'r': 7,
                            'fill': '#f6f6f6',
                            'stroke': '#ff5148',
                            'stroke-width': 2,
                            'cursor': 'pointer'
                        }
                    }, {
                        tagName: 'path',
                        selector: 'icon',
                        attributes: {
                            'd': 'M -3 -3 3 3 M -3 3 3 -3',
                            'fill': 'none',
                            'stroke': '#ff5148',
                            'stroke-width': 2,
                            'pointer-events': 'none'
                        }
                    }],
                    action: function (evt: dia.Event, view: dia.LinkView, tool: dia.ToolView) {
                        const link = view.model,
                            sourceId = link.get('source'),
                            targetId = link.get('target');
                        console.log('sourceId', sourceId);
                        console.log('targetId', targetId);
                        link.remove();
                    }
                }),
                // new linkTools.SourceArrowhead(),
                new linkTools.TargetArrowhead()
            ]
        });
        linkView.addTools(tools);
    }

    function editTable(tableView: dia.ElementView) {

        const HIGHLIGHTER_ID = 'table-selected';
        const table = tableView.model as Table;
        const tableName = table.getName();
        if (TableHighlighter.get(tableView, HIGHLIGHTER_ID)) return;

        TableHighlighter.add(tableView, 'root', HIGHLIGHTER_ID);

        const inspector = new ui.Inspector({
            cell: table,
            theme: 'default',
            inputs: {
                'attrs/tabColor/fill': {
                    label: 'Color',
                    type: 'color'
                },
                'attrs/headerLabel/text': {
                    label: 'Name',
                    type: 'text'
                },
                'columns': {
                    label: 'Columns',
                    type: 'list',
                    addButtonLabel: 'Add Column',
                    removeButtonLabel: 'Remove Column',
                    item: {
                        type: 'object',
                        properties: {
                            name: {
                                label: 'Name',
                                type: 'text'
                            },
                            type: {
                                label: 'Type',
                                type: 'select',
                                options: [
                                    'char',
                                    'varchar',
                                    'int',
                                    'datetime',
                                    'timestamp',
                                    'boolean',
                                    'enum',
                                    'uniqueidentifier'
                                ]
                            },
                            key: {
                                label: 'Key',
                                type: 'toggle'
                            }
                        }
                    }
                }
            }
        });

        inspector.render();
        inspector.el.style.position = 'relative';

        const dialog = new ui.Dialog({
            theme: 'default',
            modal: false,
            draggable: true,
            closeButton: false,
            width: 300,
            title: tableName || 'New Table*',
            content: inspector.el,
            buttons: [
                {
                    content: 'Remove',
                    action: 'remove',
                    position: 'left'
                },
                {
                    content: 'Close',
                    action: 'close'
                }
            ]
        });

        dialog.open(appEl);

        const dialogTitleBar = dialog.el.querySelector('.titlebar') as HTMLDivElement;
        const dialogTitleTab = document.createElement('div');
        dialogTitleTab.style.background = table.getTabColor();
        dialogTitleTab.setAttribute('class', 'titletab');
        dialogTitleBar.appendChild(dialogTitleTab);

        inspector.on('change:attrs/tabColor/fill', () => {
            dialogTitleTab.style.background = table.getTabColor();
        });
        inspector.on('change:attrs/headerLabel/text', () => {
            dialogTitleBar.textContent = table.getName();
        });

        dialog.on('action:close', () => {
            inspector.remove();
            TableHighlighter.remove(tableView, HIGHLIGHTER_ID);
        });
        dialog.on('action:remove', () => {
            dialog.close();
            table.remove();
        });

        if (!tableName) {
            const inputEl = inspector.el.querySelector('input[data-attribute="attrs/headerLabel/text"]') as HTMLInputElement;
            inputEl.focus();
        }
    }

    const json = document.getElementById('json') as HTMLTextAreaElement
    json.value = JSON.stringify(graph.toJSON());

};
