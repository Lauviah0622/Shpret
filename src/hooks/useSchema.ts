import { useDispatch, useSelector } from "react-redux";
import { schemaSelector, createSchemaAction, SchemaState } from '../redux/feature/schema/schemaSlice';


export default function useSchema() {
  const schema = useSelector(schemaSelector);
  const dispatch = useDispatch();

  const setSchema = (schemaArray:SchemaState['schema']) => {
    dispatch(createSchemaAction(schemaArray))
  }

  return [schema, setSchema] as const
};
