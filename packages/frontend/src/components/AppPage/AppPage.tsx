import { Permissions } from '^@services/permissions'

interface Props {
  permission: Permissions
}

export const AppPage = (PageComponent: React.FC, { permission }: Props) => {
  const Component = (props) => {
    /**
     * Check permission for page
     */
    const allowed = [Permissions.PUBLIC].includes(permission)

    /**
     * If not allowed, render nothing (@todo: or redirect)
     */
    if (!allowed) {
      return null
    }

    /**
     * Render page
     */
    return <PageComponent {...props} />
  }

  return Component
}
