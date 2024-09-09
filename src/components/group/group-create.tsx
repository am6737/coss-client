import React, { useEffect, useState, useCallback } from "react";
import { Avatar, Card, Divider, Input, Typography, Dropdown, Modal, message, Segmented, List } from "antd";
import { PlusCircleOutlined, SearchOutlined, ArrowLeftOutlined, CameraOutlined, CheckOutlined, MinusCircleOutlined } from "@ant-design/icons";
import ThemeButton from "../common/theme-button";
import VirtualList from 'rc-virtual-list';

const { Text } = Typography;

interface UserItem {
    id: number,
    lastOnline: string,
    email: string;
    gender: string;
    name: {
        first: string;
        last: string;
        title: string;
    };
    nat: string;
    picture: {
        large: string;
        medium: string;
        thumbnail: string;
    };
}

const GroupCreate: React.FC = () => {
    // 群组基本信息状态
    const [groupInfo, setGroupInfo] = useState({
        name: "",
        type: "公开",
        chatHistoryLimit: "无",
        messageSaveTime: "永远",
        autoDissolve: "永不",
        avatarUrl: null as string | null,
    });

    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [alignValue, setAlignValue] = useState<'近期访问' | '联系人' | '管理的群'>('近期访问');
    const [data, setData] = useState<UserItem[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<UserItem[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const ContainerHeight = 400;
    const fakeDataUrl = 'https://randomuser.me/api/?results=20&inc=name,gender,email,nat,picture&noinfo';

    useEffect(() => {
        appendData();
    }, []);

    const appendData = useCallback(() => {
        fetch(fakeDataUrl)
            .then((res) => res.json())
            .then((body) => {
                setData(prevData => [...prevData, ...body.results]);
                message.success(`${body.results.length} 个新项目已加载！`);
            });
    }, []);

    const handleInputChange = useCallback((key: string, value: string) => {
        setGroupInfo(prev => ({ ...prev, [key]: value }));
    }, []);

    const renderDropdown = useCallback((
        title: string,
        value: string,
        options: string[],
        key: string
    ) => (
        <>
            <div className="p-4 flex justify-between items-center">
                <Text className="text-sm leading-tight">{title}</Text>
                <Dropdown
                    menu={{
                        items: options.map(option => ({ key: option, label: option })),
                        onClick: ({ key: optionKey }) => handleInputChange(key, optionKey),
                    }}
                    arrow
                    placement="topRight"
                    trigger={['click']}
                >
                    <Text className="text-sm leading-tight text-gray-500 cursor-pointer">
                        {value}
                    </Text>
                </Dropdown>
            </div>
            <Divider className="m-0" />
        </>
    ), [handleInputChange]);

    const handleAddMember = useCallback(() => setIsModalVisible(true), []);
    const handleModalClose = useCallback(() => setIsModalVisible(false), []);

    const handleUserSelect = useCallback((user: UserItem) => {
        setSelectedUsers(prev =>
            prev.some(u => u.email === user.email)
                ? prev.filter(u => u.email !== user.email)
                : [...prev, user]
        );
    }, []);

    const handleRemoveUser = useCallback((email: string) => {
        setSelectedUsers(prev => prev.filter(user => user.email !== email));
    }, []);

    const handleNextStep = useCallback(() => handleModalClose(), [handleModalClose]);

    const handleUploadAvatar = useCallback(() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (event) => {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    handleInputChange('avatarUrl', e.target?.result as string);
                };
                reader.readAsDataURL(file);
            } else {
                message.error('请选择一个有效的图片文件');
            }
        };
        input.click();
    }, [handleInputChange]);

    const handleSubmit = useCallback(async () => {
        if (!groupInfo.name) return;

        try {
            const groupData = {
                ...groupInfo,
                members: selectedUsers.map(user => user.email)
            };

            console.log('groupData', groupData)
            // TODO 发送请求
        } catch (error) {
            console.error('创建群组时出错：', error);
            message.error('创建群组时发生错误，请稍后重试。');
        }
    }, [groupInfo, selectedUsers]);

    const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    }, []);

    const filteredData = data.filter(user => 
        user.name.first.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name.last.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const renderMemberModal = useCallback(() => (
        <Modal
            title={
                <div className="flex items-center">
                    <ArrowLeftOutlined className="mr-2 cursor-pointer" onClick={handleModalClose} />
                    <span className="flex-grow text-center">添加成员</span>
                </div>
            }
            open={isModalVisible}
            onCancel={handleModalClose}
            footer={
                <>
                    <Divider className="m-0 pt-2"></Divider>
                    <div className="flex items-center justify-end pt-3">
                        <Text type="secondary" className="mr-2">{selectedUsers.length} 已选择</Text>
                        <ThemeButton shape="round" disabled={selectedUsers.length === 0} onClick={handleNextStep}>
                            下一步
                        </ThemeButton>
                    </div>
                </>
            }
            width={600}
        >
            {/* 搜索用户输入框 */}
            <Input
                className="rounded-xl"
                variant="filled"
                placeholder="搜索用户"
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={handleSearch}
            />
            {/* 分段控制器：近期访问、联系人、管理的群 */}
            <div className="mt-2 mb-2">
                <Segmented
                    className="w-full overflow-hidden mx-auto flex justify-center "
                    value={alignValue}
                    onChange={(value) => setAlignValue(value as typeof alignValue)}
                    options={[
                        { label: '近期访问', value: '近期访问', className: 'flex-1 text-center rounded-[10px]' },
                        { label: '联系人', value: '联系人', className: 'flex-1 text-center rounded-[10px]' },
                        { label: '管理的群', value: '管理的群', className: 'flex-1 text-center rounded-[10px]' }
                    ]}
                />
            </div>
            {/* 用户列表 */}
            <List>
                <VirtualList
                    data={filteredData}
                    height={ContainerHeight}
                    itemHeight={47}
                    itemKey="email"
                >
                    {(item: UserItem) => (
                        <List.Item key={item.email} onClick={() => handleUserSelect(item)} className="cursor-pointer">
                            <List.Item.Meta
                                avatar={
                                    <div className="flex items-center">
                                        {/* 选择状态指示器 */}
                                        <div className={`w-5 h-5 border rounded-full flex items-center justify-center ${selectedUsers.some(u => u.email === item.email) ? 'bg-primary border-primary' : ''}`}>
                                            {selectedUsers.some(u => u.email === item.email) && <CheckOutlined className="text-white" />}
                                        </div>
                                        <Avatar className="ml-3" size="large" src={item.picture.large} />
                                    </div>
                                }
                                title={<a href="">{item.name.last}</a>}
                                description={`最后在线：${item.lastOnline}`}
                            />
                        </List.Item>
                    )}
                </VirtualList>
            </List>
        </Modal>
    ), [isModalVisible, handleModalClose, selectedUsers, alignValue, filteredData, handleUserSelect, handleNextStep, searchTerm, handleSearch]);

    // 渲染群组创建页面
    return (
        <div className="group-create bg-gray-100">
            {/* 群组基本信息卡片 */}
            <Card bordered={false} className="text-center flex flex-col h-full ant-card-body-p-0 pt-5 pb-3" style={{ borderRadius: 0 }}>
                {/* 群组头像 */}
                <Avatar
                    src={groupInfo.avatarUrl}
                    size={96}
                    className="mb-2 cursor-pointer hover:opacity-80"
                    icon={<CameraOutlined />}
                    onClick={handleUploadAvatar}
                />
                {/* 群组名称输入框 */}
                <Input
                    placeholder="请输入群组名称"
                    variant="borderless"
                    maxLength={30}
                    showCount
                    className="text-center"
                    value={groupInfo.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    inputMode="text"
                />
                <Divider className="m-0" />
                <Text type="secondary" className="block pt-3">描述信息或其他提示信息</Text>
            </Card>

            {/* 群组类型选择 */}
            <div className="mt-2 bg-white">
                {renderDropdown("群类型", groupInfo.type, ["公开", "私有", "临时", "话题"], 'type')}
            </div>

            {/* 群组设置选项 */}
            <div className="mt-2 bg-white">
                {renderDropdown("聊天记录限制", groupInfo.chatHistoryLimit, ["无", "1天", "7天", "30天"], 'chatHistoryLimit')}
                {renderDropdown("保存消息", groupInfo.messageSaveTime, ["永远", "1个月", "3个月", "6个月"], 'messageSaveTime')}
                {renderDropdown("自动解散", groupInfo.autoDissolve, ["永不", "1个月", "3个月", "6个月"], 'autoDissolve')}
            </div>

            {/* 群组成员管理 */}
            <div className="mt-2 bg-white">
                <div className="p-4 flex justify-between items-center">
                    <Text className="text-sm leading-tight text-gray-500">
                        成员
                        <Text className="text-sm leading-tight text-gray-500">({selectedUsers.length + 1}/256)</Text>
                    </Text>
                    {/* 添加成员按钮 */}
                    <div
                        className="flex items-center text-gray-500 text-primary hover:text-primary cursor-pointer"
                        onClick={handleAddMember}
                    >
                        <PlusCircleOutlined className="mr-2 text-lg" />
                        <span>添加成员</span>
                    </div>
                </div>
                <Divider className="m-0" />
                {/* 已选成员列表 */}
                {selectedUsers.map((user) => (
                    <div key={user.email} className="p-4 flex justify-between items-center">
                        <div className="flex items-center">
                            <Avatar src={user.picture.thumbnail} />
                            <Text className="ml-2">{user.name.first} {user.name.last}</Text>
                        </div>
                        {/* 移除成员按钮 */}
                        <MinusCircleOutlined
                            className="text-red-500 cursor-pointer text-lg"
                            onClick={() => handleRemoveUser(user.email)}
                        />
                    </div>
                ))}
            </div>

            {/* 完成按钮 */}
            <div className="flex justify-between w-full bg-white mt-2 pt-4">
                <button
                    className={`flex-1 ${!groupInfo.name ? 'text-gray-400 cursor-not-allowed' : 'text-green-500'}`}
                    onClick={handleSubmit}
                    disabled={!groupInfo.name}
                >
                    完成
                </button>
            </div>

            {/* 渲染添加成员模态框 */}
            {renderMemberModal()}
        </div>
    );
};

export default GroupCreate;
