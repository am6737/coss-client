// 在群组中用户展示的名称
import { Link, List, ListInput, Navbar, NavRight, Page } from 'framework7-react'

const GroupUserDisplayName = () => {
	return (
		<Page noToolbar>
			<Navbar backLink>
				<NavRight><Link>提交</Link></NavRight>
			</Navbar>
			<div className="flex h-full flex-col">
				<div>
					<List className='mx-[16px]' strongIos outlineIos dividersIos form formStoreData>
						<ListInput
							name="name"
							type="text"
							clearButton
							defaultValue={'123456'}
							autofocus
						/>
					</List>
				</div>
			</div>
		</Page>
	)
}

export default GroupUserDisplayName