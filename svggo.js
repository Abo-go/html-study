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

document.getElementById('svgDiv');
const svg = createSvgNode(document.getElementById('svgDiv'), 'svg');
svg.setAttribute('width', 500);
svg.setAttribute('height', 500);

const rect = createSvgNode(svg, 'rect');
rect.setAttribute('width', 500);
rect.setAttribute('height', 500);
rect.setAttribute('fill', 'pink');

const g1 = createSvgNode(svg, 'g');
g1.setAttribute('font-size', 30);
g1.setAttribute('text-anchor', 'middle');


const notes = [
    new Note(1, 1),
    new Note(),
    new Note(6, 0),
    new Note(5, 0)
]

notes.forEach(function(item, index, array){
    createSvgText(g1, item.noteName, 30 * (index + 1), 50);
});
