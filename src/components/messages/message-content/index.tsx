import { useElementSize } from '@reactuses/core'
import { Flex } from 'antd'
import { useCallback, useRef } from 'react'
import MessageItem from './message-item'
import VirtualList from '@/components/virtualizer-list/virtual-list'
import MessageList from './message-list'

interface MessageContentProps {
    messages: Message[]
    start?: number
}

const MessageContent: React.FC<MessageContentProps> = ({ messages, start = 0 }) => {
    const parentRef = useRef<HTMLDivElement>(null)
    const [height] = useElementSize(parentRef)

    const renderItem = useCallback(
        (item: Message) => {
            return <MessageItem message={item} key={item.msg_id} item-key={item.msg_id} />
        },
        [messages]
    )

    return (
        <Flex
            className="container--background flex-1 overflow-y-auto overflow-x-hidden relative "
            ref={parentRef}
            vertical
        >
            {/* <MessageList height={height} messages={messages.reverse()} /> */}
            <VirtualList height={height} data={messages.reverse()} reverse renderItem={renderItem} />
        </Flex>
    )
}

export default MessageContent
