const gFontSize = 30;

document.getElementById('svgDiv');
const svg = createSvgNode(document.getElementById('svgDiv'), 'svg');
svg.setAttribute('width', 500);
svg.setAttribute('height', 500);

const rect = createSvgNode(svg, 'rect');
rect.setAttribute('width', 500);
rect.setAttribute('height', 500);
rect.setAttribute('fill', 'pink');

const g1 = createSvgNode(svg, 'g');
g1.setAttribute('font-size', gFontSize);
g1.setAttribute('text-anchor', 'middle');

enum ChromaType {
    Sharp,
    Natural,
    Flat,
}

enum NoteType 
{
    PlaceHolder = 8,
}

abstract class Renderable 
{
    x : number;
    y : number;
    move(x: number, y: number)
    {
        this.x = x;
        this.y = y;
    }
    abstract render(): void;
}

abstract class Layerable extends Renderable
{

}

class Note extends Renderable 
{
    readonly note: number;
    readonly chromatic: number;
    readonly octave:number;

    children: Note[] = [];

    constructor(note: number = NoteType.PlaceHolder, octave: number = 0, chroma: number = ChromaType.Natural)
    {
        super();
        this.note = note;
        this.octave = octave;
        this.chromatic = chroma;
    }

    get noteName()
    {
        if(this.note == NoteType.PlaceHolder)
        {
            return '-';
        }
        else
        {
            return this.note.toString();
        }
    }

    override render()
    {
        createSvgText(g1, this.noteName, this.x, this.y);
        let cx = this.x, cy = this.y;
        for(let i = 0; i < Math.abs(this.octave); i++)
        {
            if(this.octave > 0)
            {
                cy = this.y + gFontSize / 2 + i * 5;
            }
            else
            {
                cy = this.y - gFontSize / 2 + i * 5;
            }
    
            let circle = createSvgNode(parent, 'circle');
            circle.setAttribute('cx', cx);
            circle.setAttribute('cy', cy);
            circle.setAttribute('r', 3);
        }
    }
}

class Beat extends Renderable
{
    notes: Note[] = [];
    space: number = 30;

    appendChild(note: Note)
    {
        this.notes.push(note);
    }

    override move(x: number, y: number)
    {
        super.move(x, y);

    }

    override render()
    {

    }
}



function createSvgNode(parent, name)
{
    var node = document.createElementNS('http://www.w3.org/2000/svg', name);
    parent.appendChild(node);
    return node;
}

function createSvgText(parent, text, x, y)
{
    var node = createSvgNode(parent, 'text');
    node.setAttribute('x', x);
    node.setAttribute('y', y);
    node.textContent = text;
}

// 绘制小节线
function createBarLine(parent, x, y)
{
    var node = createSvgNode(parent, 'line');
    node.setAttribute('x1', x);
    node.setAttribute('y1', y);
    node.setAttribute('x2', x);
    node.setAttribute('y2', y + gFontSize);
}

function render()
{
    var inputNode = document.getElementById("myInput") as HTMLTextAreaElement;
    var inputValue:string = inputNode.value;

    //标出所有音符的位置
    let beats: Beat[] = [];
    let tmpBeat = new Beat;
    let inBar = false;
    for(let i = 0; i < inputValue.length; i++)
    {
        inputValue.charAt
        let s = inputValue.charAt(i);
        
        if(s == '(')
        {
            inBar = true;
        }
        else if(s == ')')
        {
            inBar = false;
        }
        else if(s == '-')
        {
            tmpBeat.appendChild(new Note);
        }
        else
        {
            let n: number = parseInt(s);
            if(n >= 0 && n < 8)
            {
                // chrom
                let idx = i - 1;
                let chrom = ChromaType.Natural;
                if(inputValue.charAt(idx) == 'b')
                {
                    chrom = ChromaType.Flat;
                }
                else if(inputValue.charAt(idx) == '#')
                {
                    chrom = ChromaType.Sharp;
                }

                // octave
                let octave = 0;
                idx = i;
                while(inputValue.charAt(++idx) == '\'')
                {
                    octave++;
                }
                idx = i;
                while(inputValue.charAt(++idx)=='\,')
                {
                    octave--;
                }

                tmpBeat.appendChild(new Note(n, octave, chrom));
            }
        }

        if(inBar == false && tmpBeat.notes.length > 0)
        {
            beats.push(tmpBeat);
            tmpBeat = new Beat;
        }
    }

    //自动划分小节
    let lineSpace = 50;
    let colSpace = 30;
    let startX = 30;

    let lineNum = beats.length / 4;

    for(let i = 0; i < lineNum; i++)
    {
        // 每行4个小节16个音符
        let y = lineSpace * (i + 1);
        // 开头绘制小节线
        createBarLine(g1, startX, y);
        for(let j = 0; j < 4; j++)
        {
            for(let k = 0; k < 4; k++)
            {            
                let noteIdx = i * 16 + j * 4 + k;
                if(noteIdx >= beats.length)
                {
                    break;
                }

                let x = startX + colSpace * (j * 4 + k);
                beats[noteIdx].move(x, y);
            }
        }
    }
    return 0;
}
