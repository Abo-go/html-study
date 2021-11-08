const ChromaEnum = {
    Sharp:1,
    Natural:2,
    Flat:3,
}

const NoteEnum = {
    PlaceHolder:8,
}

class Note
{
    note = NoteEnum.PlaceHolder;
    chromatic = ChromaEnum.Natural;
    octave = 0;
    //note 音符0,1,2,3,4,5,6,7
    constructor(note, octave, chromatic)
    {
        if(note != undefined)
        {
            this.note = note;
        }

        if(octave != undefined)
        {
            this.octave = octave;
        }

        if(chromatic != undefined)
        {
            this.chromatic = chromatic;       
        }
    }

    get noteName()
    {
        if(this.note == NoteEnum.PlaceHolder)
        {
            return '-';
        }
        else
        {
            return this.note.toString();
        }
    }
}

class Beat
{
    notes = [];

    appendChild(note)
    {
        this.notes.push(note);
    }
}

const gFontSize = 30;

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

function createSvgNote(parent, note, x, y)
{
    createSvgText(parent, note.noteName, x, y);
    let cx = x, cy = y;
    for(let i = 0; i < Math.abs(note.octave); i++)
    {
        if(note.octave > 0)
        {
            cy = y + gFontSize / 2 + i * 5;
        }
        else
        {
            cy = y - gFontSize / 2 + i * 5;
        }

        let circle = createSvgNode(parent, 'circle');
        circle.setAttribute('cx', cx);
        circle.setAttribute('cy', cy);
        circle.setAttribute('r', 3);
    }
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


// const notes = [
//     new Note(1, 1),
//     new Note(),
//     new Note(6, 0),
//     new Note(5, 0)
// ]

// notes.forEach(function(item, index, array){
//     createSvgText(g1, item.noteName, 30 * (index + 1), 50);
// });

function render()
{
    var inputValue = document.getElementById("myInput").value;

    //标出所有音符的位置
    let beats = [];
    let bar = new Beat;
    let inBar = false;
    for(let i in inputValue)
    {
        let s = inputValue.at(i);
        
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
            bar.appendChild(new Note);
        }
        else
        {
            let n = new Number(s);
            if(n >= 0 && n < 8)
            {
                // chrom
                let idx = i - 1;
                let chrom = ChromaEnum.Natural;
                if(inputValue.at(idx) == 'b')
                {
                    chrom = ChromaEnum.Flat;
                }
                else if(inputValue.at(idx) == '#')
                {
                    chrom = ChromaEnum.Sharp;
                }

                // octave
                let octave = 0;
                idx = i;
                while(inputValue.at(++idx) == '\'')
                {
                    octave++;
                }
                idx = i;
                while(inputValue.at(++idx)=='\,')
                {
                    octave--;
                }

                bar.appendChild(new Note(n, octave, chrom));
            }
        }

        if(inBar == false && bar.notes.length > 0)
        {
            beats.push(bar);
            bar = new Beat;
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
                let x = startX + colSpace * (j * 4 + k);
                createSvgNote(g1, beats[noteIdx], x, y);
            }
        }
    }
    return 0;
}