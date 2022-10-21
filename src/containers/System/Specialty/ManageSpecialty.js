import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./ManageSpecialty.scss";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../utils";
import { createNewSpecialty, getAllSpecialtyInfo } from "../../../services/userService";
import { toast } from "react-toastify";
import Select from 'react-select';
import * as actions from "../../../store/actions";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageSpecialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      imageBase64: "",
      descriptionHTML: "",
      descriptionMarkdown: "",
      listSpecialty: [],
      selectedOption: '',
      hasOldData: false,
      previewImgURL: "",
    };
  }

  async componentDidMount() {
    this.props.fetchAllSpecialty();
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }

    const dataSelect = this.buildDataInputSelect(this.props.allSpecialty)

    if (prevProps.allSpecialty !== this.props.allSpecialty) {
      this.setState({
        listSpecialty: dataSelect
      })
    }
  }

  buildDataInputSelect = (inputData) => {
    let result = [];
    if (inputData && inputData.length > 0) {
      inputData.map((item, idx) => {
        let object = {};

        object.label = item.name;
        object.value = item.id;
        result.push(object)
      })
    }

    return result;
  }

  handleOnChangeInput = (event, id) => {
    let stateCopy = { ...this.state };
    stateCopy[id] = event.target.value;
    this.setState({
      ...stateCopy,
    });
  };

  handleEditorChange = ({ html, text }) => {
    this.setState({
      descriptionHTML: html,
      descriptionMarkdown: text,
    });
  };

  handleOnChangeImage = async (event) => {
    let data = event.target.files;
    let file = data[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      let objectUrl = URL.createObjectURL(file);
      this.setState({
        previewImgURL: objectUrl,
        imageBase64: base64,
      });
    }
  };

  handleSaveNewSpecialty = async () => {
    let { hasOldData } = this.state
    let res = await createNewSpecialty({
      name: this.state.name,
      imageBase64: this.state.imageBase64,
      descriptionHTML: this.state.descriptionHTML,
      descriptionMarkdown: this.state.descriptionMarkdown,
      specialtyId: this.state.selectedOption.value,
      action: hasOldData === true ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,
    });

    if (res && res.errCode === 0) {
      toast.success("Add new specialty succeeds!");
      this.setState({
        name: "",
        imageBase64: "",
        descriptionHTML: "",
        descriptionMarkdown: "",
      });
    } else {
      toast.error("Something wrongs!");
    }
  };

  openPreviewImage = () => {
    if (!this.state.previewImgURL) return;
    this.setState({
      isOpen: true,
    });
  };

  handleChange = async (selectedOption) => {
    this.setState({ selectedOption });

    let res = await getAllSpecialtyInfo(selectedOption.value);
    console.log('check res specialty>>', res)
    let name = '',
      descriptionHTML = '',
      descriptionMarkdown = '',
      previewImgURL = '',
      imageBase64 = '';
    if (res && res.data) {
      if (res.data.image) {
        previewImgURL = new Buffer(res.data.image, "base64").toString("binary");
      }
      name = res.data.name;
      descriptionHTML = res.data.descriptionHTML;
      descriptionMarkdown = res.data.descriptionMarkdown;

      // imageBase64 = res.data.image

      this.setState({
        name: name,
        descriptionHTML: descriptionHTML,
        descriptionMarkdown: descriptionMarkdown,
        previewImgURL: previewImgURL,
        imageBase64: previewImgURL,
        hasOldData: true
      })
    }

  };


  render() {
    console.log('check state specialty >>>', this.state)
    let { hasOldData } = this.state
    return (
      <div className="manage-specialty-container">
        <div className="ms-title">Quản lý chuyên khoa</div>

        <div className="add-new-specialty row">
          <div className="col-6 form-group">
            <label>Chọn chuyên khoa</label>
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChange}
              options={this.state.listSpecialty}
              placeholder={'chọn chuyên khoa'}
            />
          </div>
          <div className="col-6 form-group">
            <label>Tên chuyên khoa</label>
            <input
              className="form-control"
              type="text"
              value={this.state.name}
              onChange={(event) => this.handleOnChangeInput(event, "name")}
            />
          </div>
          <div className="col-6 form-group">
            <label>Ảnh chuyên khoa</label>
            <input
              className="form-control-file"
              type="file"
              onChange={(event) => this.handleOnChangeImage(event)}
            />
            <div
              className="preview-image"
              style={{
                backgroundImage: `url(${this.state.previewImgURL})`,
              }}
              onClick={() => this.openPreviewImage()}
            ></div>
          </div>
          <div className="col-12">
            <MdEditor
              style={{ height: "300px" }}
              renderHTML={(text) => mdParser.render(text)}
              onChange={this.handleEditorChange}
              value={this.state.descriptionMarkdown}
            />
          </div>
          <div className="col-12 btn-submit">
            {hasOldData === true ?
              <button
                className="btn-save-specialty"
                onClick={() => this.handleSaveNewSpecialty()}
              >
                Save
              </button>
              :
              <button
                className="btn-create-specialty"
                onClick={() => this.handleSaveNewSpecialty()}
              >
                Create New
              </button>
            }
          </div>
        </div>
        {this.state.isOpen === true && (
          <Lightbox
            mainSrc={this.state.previewImgURL}
            onCloseRequest={() => this.setState({ isOpen: false })}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    allSpecialty: state.admin.allSpecialty
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllSpecialty: () => dispatch(actions.fetchAllSpecialty())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);
