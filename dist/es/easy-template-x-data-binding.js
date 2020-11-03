import { Path, TemplateExtension, toDictionary, XmlDepthTracker, first, XmlNodeType, UnknownContentTypeError, TemplatePlugin, XmlNode } from 'easy-template-x';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

/**
 * http://officeopenxml.com/anatomyofOOXML.php
 */

class CustomXmlFiles {
  constructor(zip, xmlParser) {
    this.zip = zip;
    this.xmlParser = xmlParser;

    _defineProperty(this, "loaded", false);

    _defineProperty(this, "files", new Map());
  }

  async save() {
    if (!this.loaded) {
      // Never loaded the custom XML Files so they cannot have been changed
      return;
    }

    this.files.forEach((value, key) => {
      this.zip.setFile(key, this.xmlParser.serialize(value));
    });
  }

  async load() {
    if (this.loaded) {
      return this.files;
    }

    console.log("OnePoint was here...");

    for (const path of this.zip.listFiles()) {
      if (!path.match(CustomXmlFiles.itemFileRegEx)) continue;
      const filename = Path.getFilename(path);
      if (!filename) continue;
      const fileData = await this.zip.getFile(path).getContentText();

      if (!fileData.includes('<Data xmlns="Template">')) {
        console.log("Skipped file " + filename);
        continue;
      }

      const node = this.xmlParser.parse(fileData);
      this.files.set(path, node);
    }

    this.loaded = true;
    return this.files;
  }

}

_defineProperty(CustomXmlFiles, "itemFileRegEx", /customXml\/item(\d+)\.xml/);

/**
 * Returns the 'path' from the document root to the node i.e. \ancestors\parent\node.
 * **/
const XmlNodePath = {
  getPath: function getPath(node) {
    return `${node.parentNode ? getPath(node.parentNode) : ""}/${node.nodeName}`;
  }
};

class DataBindingExtension extends TemplateExtension {
  /**
   * Version number of the `easy-template-x` library.
   */

  /* eslint-disable @typescript-eslint/indent */

  /* eslint-enable @typescript-eslint/indent */
  constructor(plugins) {
    super();

    _defineProperty(this, "version",  "0.2.0" );

    _defineProperty(this, "pluginsLookup", void 0);

    _defineProperty(this, "maxXmlDepth", 20);

    this.pluginsLookup = toDictionary(plugins, p => p.contentType);
  }

  async execute(data, context) {
    const customXmlFiles = new CustomXmlFiles(context.docx.rawZipFile, this.utilities.xmlParser);
    (await customXmlFiles.load()).forEach(customXmlFile => {
      this.findNodes(customXmlFile).forEach(node => {
        this.updateNode(node, data);
      });
    });
    await customXmlFiles.save();
  }

  findNodes(node) {
    const nodes = [];
    const depth = new XmlDepthTracker(this.maxXmlDepth);

    while (node) {
      if (this.isMatch(node)) {
        nodes.push(node);
      }

      node = this.findNextNode(node, depth);
    }

    return nodes;
  }

  findNextNode(node, depth) {
    // children
    if (node.childNodes && node.childNodes.length) {
      depth.increment();
      return first(node.childNodes);
    } // siblings


    if (node.nextSibling) return node.nextSibling; // parent sibling

    while (node.parentNode) {
      if (node.parentNode.nextSibling) {
        depth.decrement();
        return node.parentNode.nextSibling;
      } // go up


      depth.decrement();
      node = node.parentNode;
    }

    return null;
  }

  isMatch(node) {
    if (node.nodeType === XmlNodeType.Text) {
      return false;
    }

    if (!node.childNodes) {
      return true;
    }

    if (node.childNodes.length === 0) {
      return true;
    }

    if (first(node.childNodes).nodeType === XmlNodeType.Text) {
      return true;
    }

    return false;
  }

  updateNode(node, data) {
    const value = XmlNodePath.getPath(node);
    const content = data.allData[value];

    if (!content) {
      return;
    }

    const contentType = content._type;
    const plugin = this.pluginsLookup[contentType];

    if (!plugin) {
      throw new UnknownContentTypeError(contentType, value, data.path.join("."));
    }

    plugin.setNodeContents(node, content);
  }

}

/* eslint-disable @typescript-eslint/member-ordering */
class DataBindingTemplatePlugin extends TemplatePlugin {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "utilities", void 0);
  }

  setNodeContents(node, content) {
    const contentNode = XmlNode.createTextNode(this.convertToDataBindingValue(content.value));
    XmlNode.remove(XmlNode.lastTextChild(node));
    XmlNode.appendChild(node, contentNode);
  }
  /**
   * Called by the TemplateHandler at runtime.
   */


  setUtilities(utilities) {
    this.utilities = utilities;
  }

}

class DataBindingBooleanPlugin extends DataBindingTemplatePlugin {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "contentType", "boolean");
  }

  convertToDataBindingValue(value) {
    if (value === null || value === undefined) {
      return "";
    }

    return value.toString();
  }

}

class DataBindingDatePlugin extends DataBindingTemplatePlugin {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "contentType", "date");
  }

  convertToDataBindingValue(value) {
    if (value === null) {
      return "";
    }

    const date = new Date(value);

    if (isNaN(date.valueOf())) {
      return "";
    }

    return first(date.toISOString().split("T"));
  }

}

class DataBindingTextPlugin extends DataBindingTemplatePlugin {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "contentType", "text");
  }

  convertToDataBindingValue(value) {
    if (value === null || value === undefined) {
      return "";
    }

    return value.toString();
  }

}

function createDefaultDataBindingPlugins() {
  return [new DataBindingBooleanPlugin(), new DataBindingDatePlugin(), new DataBindingTextPlugin()];
}

const DataBindingPluginContent = {
  isPluginContent(content) {
    return !!content && typeof content._type === "string";
  }

};

export { CustomXmlFiles, DataBindingBooleanPlugin, DataBindingDatePlugin, DataBindingExtension, DataBindingPluginContent, DataBindingTemplatePlugin, DataBindingTextPlugin, XmlNodePath, createDefaultDataBindingPlugins };
