import { useState, useEffect } from 'react'; // MouseEvent
import {
  GetProp,
  Button,
  Col,
  Row,
  Form,
  Select,
  Input,
  Tabs,
  Popconfirm,
  PopconfirmProps,
  Modal,
  Upload,
  Checkbox,
  UploadFile,
  UploadProps,
  message,
  Spin,
} from "antd";
import ImgCrop from 'antd-img-crop';
import { useNavigate } from "react-router-dom";
import type { TabsProps } from 'antd';
import { ReloadOutlined, PlusOutlined, ExportOutlined } from '@ant-design/icons';
import { Api } from "../../../../components/api.ts";
import { CardImageCastingShadowsResponse, CardImagePairCastingShadows } from "../../../../dto/card-image.ts";
import type { Callbacks } from "rc-field-form/lib/interface";
// import { useNavigate } from "react-router-dom";
// import { Api } from '../../../../components/api';

export default function CastingShadowsCreatePage() {
  const api = new Api();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { TextArea } = Input;

  type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
  const [messageApi, contextHolder] = message.useMessage();

  const [spinning, setSpinning] = useState(false);
  const [baseImageFileList, setBaseImageFileList] = useState<UploadFile[]>([]);
  const [shadowImageFileList, setShadowImageFileList] = useState<UploadFile[]>([]);
  const [baseImageUrl, setBaseImageUrl] = useState<string>();
  const [shadowImageUrl, setShadowImageUrl] = useState<string>();
  const [showCustomTextArea, setShowCustomTextArea] = useState<boolean>(false);
  const [selectedImgThumb, setSelectedImgThumb] = useState<string>('');
  const [isThumbModalOpen, setIsThumbModalOpen] = useState<boolean>(false);
  const [selectedTabKey, setSelectedTabKey] = useState<string>('1');
  const [thumbModal, setThumbModal] =
    useState<{groupToken: string, baseImg: string, shadowImg: string}>({groupToken: '', baseImg: '', shadowImg: ''});

  const [cardImages, setCardImages] =
    useState<CardImagePairCastingShadows[]>([]);

  useEffect(() => {
    fetchCardImages();
  }, []); // Refetch cards when the sort option changes

  // const fetchHelloText = async () => {
  //   const res = await api.getHello();
  //   setHelloText(res ? res : '');
  // };

  const fetchCardImages = async () => {
    const res: CardImageCastingShadowsResponse = await api.getCardImagesCastingShadows();
    setCardImages(res.items);
  };

  // const handleScroll = useCallback(() => {
  //   if (window.innerHeight + document.documentElement.scrollTop + 50 >= document.documentElement.scrollHeight && hasMore) {
  //     fetchCards();
  //   }
  // }, [hasMore, loading]);

  const handleEffectChange = (value: string) => {
    setShowCustomTextArea(value === "custom")
  };

  const handleThumbClick = (groupToken: string, baseImg: string, shadowImg: string) => () => { // (value: MouseEvent<HTMLAnchorElement>) =>
    setThumbModal({
      groupToken: groupToken,
      baseImg: baseImg,
      shadowImg: shadowImg
    });
    showThumbModel();
  };

  const handlerChangeTab = (tabKey: string) => {
    if (tabKey == '2') {
      resetThumbSelection();
    }
    setSelectedTabKey(tabKey);
  }

  const handlerStartOverConfirm: PopconfirmProps['onConfirm'] = () => {
    resetForm();
  };

  const handlerThumbModelOk = () => {
    setSelectedImgThumb(thumbModal.groupToken);
    hideThumbModal();
  };

  const handlerThumbModelCancel = () => {
    hideThumbModal();
  };

  const showThumbModel = () => {
    setIsThumbModalOpen(true);
  };

  const hideThumbModal = () => {
    setIsThumbModalOpen(false);
  };

  // const handlerStartOverCancel: PopconfirmProps['onCancel'] = (e) => {
  //   resetForm();
  // };

  const resetForm = () => {
    form.resetFields();
    setShowCustomTextArea(false);
    resetThumbSelection();
    resetImages();
  }

  const resetThumbSelection = () => {
    setSelectedImgThumb('');
  }

  const resetImages = () => {
    setBaseImageUrl('');
    setShadowImageUrl('');
  }

  // const normFile = (e: any) => {
  //   console.log(e);
  //   if (Array.isArray(e)) {
  //     return e;
  //   }
  //   return e?.fileList;
  // };

  const handleBaseImageChange: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'removed') {
      return;
    }
    // console.log(info.file.originFileObj);
    getBase64(info.file.originFileObj as FileType, (url) => {
      setBaseImageUrl(url);
    });
  };

  const handleShadowImageChange: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'removed') {
      return;
    }
    // console.log(info.file.originFileObj);
    getBase64(info.file.originFileObj as FileType, (url) => {
      setShadowImageUrl(url);
    });
  };

  // const onPreview = async (file: UploadFile) => {
  //   console.log(file);
  //   let src = file.url as string;
  //   if (!src) {
  //     src = await new Promise((resolve) => {
  //       const reader = new FileReader();
  //       reader.readAsDataURL(file.originFileObj as FileType);
  //       reader.onload = () => resolve(reader.result as string);
  //     });
  //   }
  //   const image = new Image();
  //   image.src = src;
  //   const imgWindow = window.open(src);
  //   imgWindow?.document.write(image.outerHTML);
  // };

  const baseImageUploadProps: UploadProps = {
    onRemove: (file) => {
      const index = baseImageFileList.indexOf(file);
      const newFileList = baseImageFileList.slice();
      newFileList.splice(index, 1);
      form.setFieldsValue({
        'base_image': []
      });
      setBaseImageFileList(newFileList);
    },
    beforeUpload: (file) => {
      // console.log(file);
      form.setFieldsValue({
        'base_image': [file]
      });
      setBaseImageFileList([...baseImageFileList, file]);
      return true;
    },
    //onPreview: onPreview,
    maxCount: 1,
    onChange: handleBaseImageChange,
    showUploadList: false,
    listType: "picture-card",
    fileList: baseImageFileList,
  };

  const shadowImageUploadProps: UploadProps = {
    onRemove: (file) => {
      const index = shadowImageFileList.indexOf(file);
      const newFileList = shadowImageFileList.slice();
      newFileList.splice(index, 1);
      form.setFieldsValue({
        'shadow_image': []
      });
      setShadowImageFileList(newFileList);
    },
    beforeUpload: (file) => {
      // console.log(file);
      form.setFieldsValue({
        'shadow_image': [file]
      });
      setShadowImageFileList([...shadowImageFileList, file]);
      return true;
    },
    //onPreview: onPreview,
    maxCount: 1,
    onChange: handleShadowImageChange,
    showUploadList: false,
    listType: "picture-card",
    fileList: shadowImageFileList,
  };

  const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };

  const toBase64 = (img: FileType) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  const submitForm: Callbacks['onFinish'] = async (values) => {
    console.log(values);
    setSpinning(true);
    const formData = new FormData();
    for (const key in values) {
      if (values[key] == undefined) {
        values[key] = '';
      }
      if ((key === 'base_image' || key === 'shadow_image') && values[key]) {
        const base64Str = await toBase64(values[key][0]);
        formData.append(key, base64Str as string);
        continue;
      }
      formData.append(key, values[key]);
    }
    if (selectedTabKey == '1') {
      if (!selectedImgThumb) {
        messageApi.open({
          type: 'error',
          content: 'Please select an image',
          style: {bottom: 10},
        });
        setSpinning(false);
        return;
      }
      formData.append('image_thumb', selectedImgThumb);
    } else {
      formData.append('image_thumb', '');
    }
    const res = await api.submitCastingShadowsForm(formData);
    if (res.error) {
      messageApi.open({
        type: 'error',
        content: res.error,
        duration: 10,
        style: {bottom: 10},
      });
    } else if (res.cardToken) {
      // TODO: change it to the card view page
      navigate(`/apps/ugapp/cards/casting-shadows/view?t=${res.cardToken}`);
    }
    setSpinning(false);

    // // You can use any AJAX library you like
    // fetch('https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload', {
    //   method: 'POST',
    //   body: formData,
    // })
    //   .then((res) => res.json())
    //   .then(() => {
    //     console.log('Uploaded');
    //     // setFileList([]);
    //     // message.success('upload successfully.');
    //   })
    //   .catch(() => {
    //     console.log('Upload error');
    //     //message.error('upload failed.');
    //   })
    //   .finally(() => {
    //     console.log('Upload finally');
    //     // setUploading(false);
    //   });
  };

  const formTabs: TabsProps['items'] = [
    {
      key: '1',
      label: 'Choose An Image',
      children: <div className="casting-shadows-artworks-img-list">
        {cardImages.map((cardImage) => (
          <a className={"casting-shadows-artworks" + (selectedImgThumb === cardImage.groupToken ? ' selected' : '')}
             key={cardImage.groupToken}
             onClick={handleThumbClick(cardImage.groupToken, cardImage.baseImage.src, cardImage.shadowImage.src)}>
            <img className="img-thumb" src={cardImage.baseImage.thumb} alt={cardImage.baseImage.name}/>
            <img className="img-thumb" src={cardImage.shadowImage.thumb} alt={cardImage.shadowImage.name}/>
          </a>
          )
        )}
      </div>,
    },
    {
      key: '2',
      label: 'Upload Your Own',
      children: <div className="casting-shadows-upload-block">
        <Row>
          <Col span={12}>
            <Form.Item
              name="base_image"
              valuePropName="fileList"
              // getValueFromEvent={normFile}
              rules={[{ required: selectedTabKey == "2", message: 'The image cannot be blank!' }]}>
              <ImgCrop
                modalOk={"Ok"}
                modalCancel={"Close"}
                modalProps={{
                  okButtonProps: {
                    className: 'cs-crop-upload-ok-btn',
                  },
                  cancelButtonProps: {
                    className: 'cs-crop-upload-cancel-btn',
                  },
                }}
              >
                <Upload {...baseImageUploadProps}
                  // customRequest={() => true}
                  // showUploadList={false}
                  // maxCount={1}
                  // action="/upload.do"
                  //listType="picture-card"
                >
                  {baseImageUrl ? <img src={baseImageUrl} alt="avatar" style={{ width: '100%' }}/> :
                    <button style={{ border: 0, background: 'none' }} type="button">
                      <PlusOutlined/>
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </button>}

                </Upload>
              </ImgCrop>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="shadow_image"
                       valuePropName="fileList"
                       // getValueFromEvent={normFile}
                       rules={[{ required: selectedTabKey == "2", message: 'The image cannot be blank!' }]}>
              <ImgCrop
                modalOk={"Ok"}
                modalCancel={"Close"}
                modalProps={{
                  okButtonProps: {
                    className: 'cs-crop-upload-ok-btn',
                  },
                  cancelButtonProps: {
                    className: 'cs-crop-upload-cancel-btn',
                  },
                }}
              >
                <Upload {...shadowImageUploadProps}
                  // maxCount={1}
                  // customRequest={() => true}
                  // listType="picture-card"
                >
                  {shadowImageUrl ? <img src={shadowImageUrl} alt="avatar" style={{ width: '100%' }}/> :
                    <button style={{ border: 0, background: 'none' }} type="button">
                      <PlusOutlined/>
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </button>}
                </Upload>
              </ImgCrop>
            </Form.Item>
          </Col>
        </Row>
        <div className="casting-shadows-upload-desc">
          <p>
            Upload a JPG or PNG that is no larger than 10MB<br />
            Recommended dimensions: 1600px by 1600px
          </p>
          <p>
            Please note that if you choose to upload your own artwork, you will not be able to submit your creation to the community site.
          </p>
          <Form.Item name="terms" label="" valuePropName="checked" rules={[{ required: selectedTabKey == "2", message: 'The field cannot be blank!' }]}>
            <Checkbox>
              I agree to the <a href="https://unstablegames.com/pages/terms-of-use" target="_blank">terms and conditions <ExportOutlined /></a>
            </Checkbox>
          </Form.Item>
        </div>
      </div>,
    },
  ];

  return (
    <div className="cc-casting-shadows">
      <h1>Begin Customizing Your Player Board</h1>
      <Row justify="center">
        <Col xs={24} lg={12}>
          <Form
            layout='vertical'
            form={form}
            initialValues={{ shadow_effect: '' }}
            onFinish={submitForm}
            // onValuesChange={onFormLayoutChange}
            // style={{ maxWidth: formLayout === 'inline' ? 'none' : 600 }}
          >
            <Form.Item name="base_form_name" label="1. Base Form Name" rules={[{ required: true, message: 'The field cannot be blank!' }]}>
              <Input placeholder="input placeholder" />
            </Form.Item>
            <Form.Item name="shadow_form_name" label="2. Shadow Form Name" rules={[{ required: true, message: 'The field cannot be blank!' }]}>
              <Input placeholder="input placeholder" />
            </Form.Item>
            <Form.Item name="shadow_effect" label="3. Shadow Form Ability" rules={[{ required: true, message: 'The field cannot be blank!' }]}>
              <Select
                style={{ width: '100%', textAlign: 'left'}}
                onChange={handleEffectChange}
                options={[
                  { value: '', label: '' },
                  { value: 'effect1', label: 'Spend 3 Shadow Energy to deal 1 DMG to each enemy. This DMG cannot be reduced.' },
                  { value: 'effect2', label: 'Spend 4 Shadow Energy to reduce your HP by up to 4, then deal the same amount of DMG to each enemy.' },
                  { value: 'effect3', label: 'Spend 5 Shadow Energy to deal 5 DMG to a Hex tile in range.' },
                  { value: 'effect4', label: 'Spend 5 Shadow Energy to gain 5 HP.' },
                  { value: 'custom', label: 'Custom' },
                ]}
              />
            </Form.Item>
            <Form.Item label="" name="shadow_effect_custom"
                       rules={[{ required: showCustomTextArea, message: 'The field cannot be blank!' }]}
                       style={{display: showCustomTextArea ? 'block' : 'none'}}>
              <TextArea showCount maxLength={105} rows={4} />
            </Form.Item>

            <div className="cs-image-selection-wrapper">
              <div>4. Artwork</div>
              <div style={{ backgroundColor: '#f1eeed', padding: '0 10px 10px 10px' }}>
                <Tabs defaultActiveKey="1"
                      items={formTabs}
                      onChange={handlerChangeTab}
                />
              </div>
            </div>
            <Row style={{marginTop: '20px'}}>
              <Col span={12} style={{textAlign: 'left'}}>
                <Form.Item >
                  <Button onClick={() => navigate('/apps/ugapp/cards/casting-shadows')} style={{marginRight: '10px'}}>Cancel</Button>
                  <Popconfirm
                    title="Are you sure to start over?"
                    // description="Are you sure to start over?"
                    onConfirm={handlerStartOverConfirm}
                    // onCancel={handlerStartOverCancel}
                    okText="Yes"
                    cancelText="No"
                  >
                  <Button icon={<ReloadOutlined />}>Start Over</Button>
                  </Popconfirm>
                </Form.Item>
              </Col>
              <Col span={12} style={{textAlign: 'right'}}>
                {contextHolder}
                <Form.Item >
                  <Button type="primary" htmlType="submit">Continue</Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      <Spin spinning={spinning} size="large" fullscreen />
      <Modal className={"cs-thumb-modal"}
        // title="Basic Modal"
             okText={"Select Image"}
             cancelText={"Close"}
             cancelButtonProps={
               {
                 style: {
                   textTransform: 'none',
                   backgroundColor: '#fff',
                   border: 'none',
                   color: '#000000',
                   fontWeight: '400',
                   boxShadow: 'none',
                 }
               }
             }
             open={isThumbModalOpen}
             onOk={handlerThumbModelOk}
             onCancel={handlerThumbModelCancel}
      >
        <div style={{
          margin: '0 5px'
        }}>
          <img style={
            {
              maxWidth: '48%',
              height: 'auto',
              marginRight: '2%',
            }
          }
               className="base-image"
               src={thumbModal.baseImg} alt=""/>
          <img style={
            {
              maxWidth: '48%',
              height: 'auto',
            }
          }
               className="shadow-image"
               src={thumbModal.shadowImg} alt=""/>
        </div>
      </Modal>
      {/*{loading && <div className="loading-indicator">Loading...</div>}*/}
    </div>
  );
}
