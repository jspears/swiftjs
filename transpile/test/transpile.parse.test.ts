import { readFileSync } from "fs";
import { testTranspile } from './testUtil';
//Auto-genererated by "gen-test.sh ../../swift/test/Inputs" to make it easier to see which tests are run.
describe('../../swift/test/Inputs', function(){
  it("comment_to_something_conversion", testTranspile(readFileSync(`${__dirname}/../../../swift/test/Inputs/comment_to_something_conversion.swift`, 'utf-8')));
  it("conditional_conformance_basic_conformances_future", testTranspile(readFileSync(`${__dirname}/../../../swift/test/Inputs/conditional_conformance_basic_conformances_future.swift`, 'utf-8')));
  it("conditional_conformance_basic_conformances", testTranspile(readFileSync(`${__dirname}/../../../swift/test/Inputs/conditional_conformance_basic_conformances.swift`, 'utf-8')));
  it("conditional_conformance_recursive", testTranspile(readFileSync(`${__dirname}/../../../swift/test/Inputs/conditional_conformance_recursive.swift`, 'utf-8')));
  it("conditional_conformance_subclass_future", testTranspile(readFileSync(`${__dirname}/../../../swift/test/Inputs/conditional_conformance_subclass_future.swift`, 'utf-8')));
  it("conditional_conformance_subclass", testTranspile(readFileSync(`${__dirname}/../../../swift/test/Inputs/conditional_conformance_subclass.swift`, 'utf-8')));
  it("conditional_conformance_with_assoc_future", testTranspile(readFileSync(`${__dirname}/../../../swift/test/Inputs/conditional_conformance_with_assoc_future.swift`, 'utf-8')));
  it("conditional_conformance_with_assoc", testTranspile(readFileSync(`${__dirname}/../../../swift/test/Inputs/conditional_conformance_with_assoc.swift`, 'utf-8')));
  it("empty file", testTranspile(readFileSync(`${__dirname}/../../../swift/test/Inputs/empty file.swift`, 'utf-8')));
  it("empty", testTranspile(readFileSync(`${__dirname}/../../../swift/test/Inputs/empty.swift`, 'utf-8')));
  it("fixed_layout_class", testTranspile(readFileSync(`${__dirname}/../../../swift/test/Inputs/fixed_layout_class.swift`, 'utf-8')));
  it("forward_extension_reference", testTranspile(readFileSync(`${__dirname}/../../../swift/test/Inputs/forward_extension_reference.swift`, 'utf-8')));
  it("global_resilience", testTranspile(readFileSync(`${__dirname}/../../../swift/test/Inputs/global_resilience.swift`, 'utf-8')));
  it("polymorphic_builtins", testTranspile(readFileSync(`${__dirname}/../../../swift/test/Inputs/polymorphic_builtins.swift`, 'utf-8')));
  it("print-shims", testTranspile(readFileSync(`${__dirname}/../../../swift/test/Inputs/print-shims.swift`, 'utf-8')));
  it("resilient_class", testTranspile(readFileSync(`${__dirname}/../../../swift/test/Inputs/resilient_class.swift`, 'utf-8')));
  it("resilient_class_thunks", testTranspile(readFileSync(`${__dirname}/../../../swift/test/Inputs/resilient_class_thunks.swift`, 'utf-8')));
  it("resilient_enum", testTranspile(readFileSync(`${__dirname}/../../../swift/test/Inputs/resilient_enum.swift`, 'utf-8')));
  it("resilient_global", testTranspile(readFileSync(`${__dirname}/../../../swift/test/Inputs/resilient_global.swift`, 'utf-8')));
  it("resilient_objc_class", testTranspile(readFileSync(`${__dirname}/../../../swift/test/Inputs/resilient_objc_class.swift`, 'utf-8')));
  it("resilient_protocol", testTranspile(readFileSync(`${__dirname}/../../../swift/test/Inputs/resilient_protocol.swift`, 'utf-8')));
  it("resilient_struct", testTranspile(readFileSync(`${__dirname}/../../../swift/test/Inputs/resilient_struct.swift`, 'utf-8')));
  it("SmallStringTestUtilities", testTranspile(readFileSync(`${__dirname}/../../../swift/test/Inputs/SmallStringTestUtilities.swift`, 'utf-8')));
})
