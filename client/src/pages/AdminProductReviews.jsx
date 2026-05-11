import React, { useEffect, useState } from 'react';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import { toast } from 'sonner';
import { 
    Table, 
    Button, 
    Modal, 
    Form, 
    Input, 
    Rate, 
    Space, 
    Tag, 
    Avatar, 
    Typography,
    Card,
    Row,
    Col,
    Dropdown,
    Select,
    Image
} from 'antd';
import { 
    PlusOutlined, 
    DeleteOutlined, 
    EditOutlined,
    StarFilled,
    MoreOutlined,
    MessageOutlined,
    ShoppingOutlined,
    EyeOutlined
} from '@ant-design/icons';
import NoData from '../components/NoData';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const AdminProductReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        showSizeChanger: false
    });

    const fetchAllReviews = async () => {
        setLoading(true);
        try {
            const response = await Axios({
                ...SummaryApi.getAllProductReviews
            });
            if (response.data.success) {
                const dataWithKeys = response.data.data.map(item => ({
                    ...item,
                    key: item._id
                }));
                setReviews(dataWithKeys);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
            toast.error("Failed to fetch product reviews");
        } finally {
            setLoading(false);
        }
    };

    const fetchAllProducts = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.getProduct,
                data: {
                    page: 1,
                    limit: 1000 // Get all products for selection
                }
            });
            if (response.data.success) {
                setProducts(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    useEffect(() => {
        fetchAllReviews();
        fetchAllProducts();
    }, []);

    const handleDelete = async (productId, reviewId) => {
        try {
            const response = await Axios({
                ...SummaryApi.deleteProductReview,
                data: { productId, reviewId }
            });

            if (response.data.success) {
                toast.success(response.data.message);
                setReviews(prev => prev.filter(r => r._id !== reviewId));
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Delete failed");
        }
    };

    const [selectedProductImg, setSelectedProductImg] = useState("");

    const handleProductChange = (value) => {
        const product = products.find(p => p._id === value);
        if (product) {
            setSelectedProductImg(product.image?.[0] || "");
        }
    };

    const handleAddReview = async (values) => {
        setSubmitting(true);
        try {
            const response = await Axios({
                ...SummaryApi.addReview,
                data: {
                    productId: values.productId,
                    name: values.name,
                    stars: values.stars,
                    comment: values.comment
                }
            });

            if (response.data.success) {
                toast.success("Review added successfully");
                setShowAddModal(false);
                form.resetFields();
                setSelectedProductImg("");
                fetchAllReviews();
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to add review");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditReview = async (values) => {
        setSubmitting(true);
        try {
            const response = await Axios({
                ...SummaryApi.updateProductReview,
                data: {
                    productId: selectedReview.productId,
                    reviewId: selectedReview._id,
                    name: values.name,
                    stars: values.stars,
                    comment: values.comment
                }
            });

            if (response.data.success) {
                toast.success("Review updated successfully");
                setShowEditModal(false);
                editForm.resetFields();
                fetchAllReviews();
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to update review");
        } finally {
            setSubmitting(false);
        }
    };

    const columns = [
        {
            title: 'Product',
            dataIndex: 'productName',
            key: 'productName',
            render: (text, record) => (
                <Space>
                    <Image
                        src={record.productImage}
                        width={40}
                        height={40}
                        style={{ objectFit: 'cover', borderRadius: '4px' }}
                        fallback="https://via.placeholder.com/40"
                    />
                    <div>
                        <Text strong style={{ fontSize: '14px' }}>{text}</Text>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Customer',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: 'Rating',
            dataIndex: 'stars',
            key: 'stars',
            render: (stars) => (
                <Space size={4}>
                    <StarFilled style={{ color: '#faad14' }} />
                    <Text strong>{stars}/5</Text>
                </Space>
            ),
            sorter: (a, b) => a.stars - b.stars,
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => (
                <Text type="secondary">{new Date(date).toLocaleDateString()}</Text>
            ),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        },
        {
            title: 'Action',
            key: 'action',
            align: 'right',
            width: 100,
            render: (_, record) => {
                const items = [
                    {
                        key: 'view',
                        label: 'View',
                        icon: <EyeOutlined />,
                        onClick: () => {
                            setSelectedReview(record);
                            setShowViewModal(true);
                        }
                    },
                    {
                        key: 'edit',
                        label: 'Edit',
                        icon: <EditOutlined />,
                        onClick: () => {
                            setSelectedReview(record);
                            editForm.setFieldsValue({
                                name: record.name,
                                stars: record.stars,
                                comment: record.comment
                            });
                            setShowEditModal(true);
                        }
                    },
                    {
                        key: 'delete',
                        label: 'Delete',
                        icon: <DeleteOutlined />,
                        danger: true,
                        onClick: () => {
                            Modal.confirm({
                                title: 'Delete Review',
                                content: 'Are you sure you want to delete this product review?',
                                okText: 'Yes, Delete',
                                okType: 'danger',
                                cancelText: 'No',
                                centered: true,
                                onOk: () => handleDelete(record.productId, record._id)
                            });
                        }
                    }
                ];
                return (
                    <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
                        <Button type="text" icon={<MoreOutlined style={{ fontSize: '20px' }} />} />
                    </Dropdown>
                );
            },
        },
    ];

    return (
        <div style={{ padding: '24px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col>
                    <Title level={2} style={{ margin: 0, fontWeight: 700 }}>Product Reviews</Title>
                    <Text type="secondary">Manage reviews submitted by customers for specific products</Text>
                </Col>
                <Col>
                    <Button 
                        type="primary" 
                        icon={<PlusOutlined />} 
                        onClick={() => setShowAddModal(true)}
                        size="large"
                        style={{ borderRadius: '8px' }}
                    >
                        Add Product Review
                    </Button>
                </Col>
            </Row>

            <Card bordered={false} className="shadow-sm rounded-xl overflow-hidden" bodyStyle={{ padding: 0 }}>
                <Table 
                    columns={columns} 
                    dataSource={reviews} 
                    loading={loading}
                    pagination={{
                        ...pagination,
                        style: { margin: '16px 24px' }
                    }}
                    onChange={(p) => setPagination(p)}
                    locale={{ emptyText: <NoData /> }}
                    scroll={{ x: 800 }}
                />
            </Card>

            {/* View Modal */}
            <Modal
                title="Review Details"
                open={showViewModal}
                onCancel={() => setShowViewModal(false)}
                footer={[<Button key="close" onClick={() => setShowViewModal(false)}>Close</Button>]}
                centered
            >
                {selectedReview && (
                    <div className="space-y-4 py-4">
                        <div className="flex gap-4 items-center p-3 bg-slate-50 rounded-lg">
                            <Image src={selectedReview.productImage} width={60} height={60} style={{ borderRadius: '4px', objectFit: 'cover' }} />
                            <div>
                                <Text type="secondary" style={{ fontSize: '12px' }}>Product</Text>
                                <Title level={5} style={{ margin: 0 }}>{selectedReview.productName}</Title>
                            </div>
                        </div>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Text type="secondary" className="text-xs uppercase font-bold">Customer</Text>
                                <div className="font-bold">{selectedReview.name}</div>
                            </Col>
                            <Col span={12}>
                                <Text type="secondary" className="text-xs uppercase font-bold">Rating</Text>
                                <div className="flex items-center gap-2">
                                    <Rate disabled defaultValue={selectedReview.stars} />
                                    <Text strong>{selectedReview.stars}/5</Text>
                                </div>
                            </Col>
                        </Row>
                        <div>
                            <Text type="secondary" className="text-xs uppercase font-bold">Comment</Text>
                            <Paragraph className="mt-1 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                {selectedReview.comment}
                            </Paragraph>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Add Modal */}
            <Modal
                title="Add New Product Review"
                open={showAddModal}
                onCancel={() => setShowAddModal(false)}
                footer={null}
                centered
                destroyOnClose
            >
                <Form form={form} layout="vertical" onFinish={handleAddReview} initialValues={{ stars: 5 }}>
                    <Form.Item
                        name="productId"
                        label="Select Product"
                        rules={[{ required: true, message: 'Please select a product' }]}
                    >
                        <Select 
                            showSearch 
                            placeholder="Search and select a product" 
                            optionFilterProp="label"
                            onChange={handleProductChange}
                        >
                            {products.map(p => (
                                <Option key={p._id} value={p._id} label={p.name}>
                                    <div className="flex items-center gap-3 py-1">
                                        <Avatar 
                                            src={p.image?.[0]} 
                                            shape="square" 
                                            size={32} 
                                            className="border border-slate-100 flex-shrink-0"
                                        />
                                        <Text ellipsis className="flex-grow font-medium">{p.name}</Text>
                                    </div>
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {selectedProductImg && (
                        <div className="flex justify-center mb-4 p-2 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                            <Image 
                                src={selectedProductImg} 
                                width={100} 
                                height={100} 
                                style={{ objectFit: 'contain', borderRadius: '8px' }} 
                            />
                        </div>
                    )}

                    <Form.Item
                        name="name"
                        label="Customer Name"
                        rules={[{ required: true, message: 'Please enter customer name' }]}
                    >
                        <Input placeholder="Enter customer name" />
                    </Form.Item>

                    <Form.Item name="stars" label="Rating" rules={[{ required: true }]}>
                        <Rate />
                    </Form.Item>

                    <Form.Item
                        name="comment"
                        label="Comment"
                        rules={[{ required: true, message: 'Please enter review comment' }]}
                    >
                        <Input.TextArea rows={4} placeholder="Write the review content here..." maxLength={500} showCount />
                    </Form.Item>

                    <div className="flex justify-end gap-2 mt-4">
                        <Button onClick={() => setShowAddModal(false)}>Cancel</Button>
                        <Button type="primary" htmlType="submit" loading={submitting}>Publish Review</Button>
                    </div>
                </Form>
            </Modal>

            {/* Edit Modal */}
            <Modal
                title="Edit Product Review"
                open={showEditModal}
                onCancel={() => setShowEditModal(false)}
                footer={null}
                centered
                destroyOnClose
            >
                <Form form={editForm} layout="vertical" onFinish={handleEditReview}>
                    {selectedReview && (
                        <div className="flex items-center gap-4 mb-6 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                            <Image 
                                src={selectedReview.productImage} 
                                width={60} 
                                height={60} 
                                style={{ borderRadius: '8px', objectFit: 'cover' }} 
                            />
                            <div>
                                <Text type="secondary" className="text-[10px] uppercase font-bold tracking-wider text-blue-600">Product</Text>
                                <Title level={5} style={{ margin: 0, fontSize: '14px' }}>{selectedReview.productName}</Title>
                            </div>
                        </div>
                    )}

                    <Form.Item
                        name="name"
                        label="Customer Name"
                        rules={[{ required: true, message: 'Please enter customer name' }]}
                    >
                        <Input placeholder="Enter customer name" />
                    </Form.Item>

                    <Form.Item name="stars" label="Rating" rules={[{ required: true }]}>
                        <Rate />
                    </Form.Item>

                    <Form.Item
                        name="comment"
                        label="Comment"
                        rules={[{ required: true, message: 'Please enter review comment' }]}
                    >
                        <Input.TextArea rows={4} placeholder="Write the review content here..." maxLength={500} showCount />
                    </Form.Item>

                    <div className="flex justify-end gap-2 mt-4">
                        <Button onClick={() => setShowEditModal(false)}>Cancel</Button>
                        <Button type="primary" htmlType="submit" loading={submitting}>Save Changes</Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default AdminProductReviews;
