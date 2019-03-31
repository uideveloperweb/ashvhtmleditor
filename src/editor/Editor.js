import React, { PureComponent } from 'react';
import './editor.css';

export class Editor extends PureComponent {
    parms = [{
        "cmd": "aCommandName",
        "desc": "A DOMString representing the name of the command"
    }, {
        "cmd": "aShowDefaultUI",
        "desc": "A Boolean indicating whether the default user interface should be shown. This is not implemented in Mozilla."
    }, {
        "cmd": "aValueArgument",
        "desc": "A DOMString representing some commands (such as insertimage) require an extra value argument (the image's url). Pass an argument of null if no argument is needed."
    }];

    commands = [{
        "cmd": "bold",
        "icon": "bold",
        "desc": "Toggles bold on/off for the selection or at the insertion point. (Internet Explorer uses the STRONG tag instead of B.)"
    }, {
        "cmd": "insertHTML",
        "val": "&lt;h3&gt;Life is great!&lt;/h3&gt;",
        "icon": "code",
        "desc": "Inserts an HTML string at the insertion point (deletes selection). Requires a valid HTML string to be passed in as a value argument. (Not supported by Internet Explorer.)"
    }, {
        "cmd": "insertOrderedList",
        "icon": "list-ol",
        "desc": "Creates a numbered ordered list for the selection or at the insertion point."
    }, {
        "cmd": "insertUnorderedList",
        "icon": "list-ul",
        "desc": "Creates a bulleted unordered list for the selection or at the insertion point."
    }, {
        "cmd": "italic",
        "icon": "italic",
        "desc": "Toggles italics on/off for the selection or at the insertion point. (Internet Explorer uses the EM tag instead of I.)"
    }, {
        "cmd": "underline",
        "icon": "underline",
        "desc": "Toggles underline on/off for the selection or at the insertion point."
    }];

    commandRelation = {};

    supported= (cmd) => {
        var css = !!document.queryCommandSupported(cmd.cmd) ? "btn-succes" : "btn-error"
        return css
    };

    icon = (cmd) => {
        return (typeof cmd.icon !== "undefined") ? "fa fa-" + cmd.icon : "";
    };

    doCommand = (cmdKey) => {
        var cmd = this.commandRelation[cmdKey];
        if (this.supported(cmd) === "btn-error") {
            alert("execCommand(“" + cmd.cmd + "”)\nis not supported in your browser");
            return;
        }
        let val = (typeof cmd.val !== "undefined") ? prompt("Value for " + cmd.cmd + "?", cmd.val) : "";
        document.execCommand(cmd.cmd, false, (val || "")); // Thanks to https://codepen.io/bluestreak for finding this bug
    }

    init = () => {
        var html = '';
        html = this.commands.map((command, i) => {
            this.commandRelation[command.cmd] = command;
            return (<span key={command.cmd}>
                    <code 
                        className={`btn btn-xs ${this.supported(command)}`} 
                        title={command.desc} 
                        onMouseDown={(event)=>event.preventDefault()} 
                        onClick={()=>this.doCommand(command.cmd)}>
                            <i className={this.icon(command)}></i> {command.cmd}
                    </code>
                    </span>)
        });
        console.log(html)
        return html;
    }
    removeTags = (event) => {
        let string = document.querySelectorAll('.editor')[0].innerHTML;
        string = string.replace(/<div>/g, '<p>').replace(/<\/div>/g, '</p>')
        const array = ['b', 'strong', 'p', 'ul', 'li', 'ol', 'u', 'italic', 'i'];
        return array ? string.split("<").filter(function (val) {
            return f(array, val);
        }).map(function (val) {
            return f(array, val);
        }).join("") : string.split("<").map(function (d) {
            return d.split(">").pop();
        }).join("");
        
        function f(array, value) {
            return array.map(function (d) {
                return value.includes(d + ">");
            }).indexOf(true) !== -1 ? "<" + value : value.split(">")[1];
        }
      }
    pasteHandler = (event) => {
        const textEditor = document.querySelectorAll('.editor')[0]
        event.persist();
        setTimeout(()=>{
        let html1 = this.removeTags(event);
        document.querySelectorAll('.editor')[0].innerHTML = html1;
        textEditor.focus();
    }, 100)
    }

    getInputSelection = (el) => {
        var start = 0, end = 0, normalizedValue, range, textInputRange, len, endRange;
    
        if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
            start = el.selectionStart;
            end = el.selectionEnd;
        } else {
            range = document.selection.createRange();
    
            if (range && range.parentElement() == el) {
                len = el.value.length;
                normalizedValue = el.value.replace(/\r\n/g, "\n");
    
                // Create a working TextRange that lives only in the input
                textInputRange = el.createTextRange();
                textInputRange.moveToBookmark(range.getBookmark());
    
                // Check if the start and end of the selection are at the very end
                // of the input, since moveStart/moveEnd doesn't return what we want
                // in those cases
                endRange = el.createTextRange();
                endRange.collapse(false);
    
                if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
                    start = end = len;
                } else {
                    start = -textInputRange.moveStart("character", -len);
                    start += normalizedValue.slice(0, start).split("\n").length - 1;
    
                    if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
                        end = len;
                    } else {
                        end = -textInputRange.moveEnd("character", -len);
                        end += normalizedValue.slice(0, end).split("\n").length - 1;
                    }
                }
            }
        }
    
        return {
            start: start,
            end: end
        };
    }

  render() {
    return (
      <div>
          Editor
          <div className="editorPlaceHolder">
            {this.init()}
            <div contentEditable="true" onPaste={this.pasteHandler} className="editor">
                
            </div>
          </div>
      </div>
    )
  }
}

export default Editor
