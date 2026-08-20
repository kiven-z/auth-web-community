import useProfileDeptColumns from '../columns/useProfileDeptColumns';
import useProfilePostColumns from '../columns/useProfilePostColumns';
import useProfileUserColumns from '../columns/useProfileUserColumns';

/**
 * 用户档案与绑定关系表格/描述列
 * @returns 用户、部门、岗位相关列定义
 */
function useUserProfileColumns() {
  const user = useProfileUserColumns();
  const dept = useProfileDeptColumns();
  const post = useProfilePostColumns();

  return {
    ...user,
    ...dept,
    ...post,
  };
}

export default useUserProfileColumns;
